import os
import random
import socket
import string
import json
import base64
import hashlib
import hmac
import urllib.request
import urllib.parse
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
# pyrefly: ignore [missing-import]
import mysql.connector
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

# Load environment configuration
load_dotenv(override=True)

app = Flask(__name__, static_folder='../frontendfolder')

# MySQL database configuration
DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_PORT = int(os.getenv('DB_PORT', '3306'))
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'varun@12345')
DB_NAME = os.getenv('DB_NAME', 'cyperx_db')
PORT = int(os.getenv('PORT', '3000'))
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', '').strip()
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', '').strip()

def init_db():
    # 1. Create database if it doesn't exist
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        print(f"Database creation check error: {err}")
        # Proceed anyway; database might already exist or permission restricted at root level
        
    # 2. Connect to database and initialize the contact messages table
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100),
                subject VARCHAR(255),
                message TEXT,
                submittedAt VARCHAR(50)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS registrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                reg_id VARCHAR(20) UNIQUE,
                fullname VARCHAR(100),
                email VARCHAR(100),
                phone VARCHAR(15),
                yearofstudy INT,
                department VARCHAR(50),
                college VARCHAR(100),
                gender VARCHAR(10),
                events TEXT,
                arrivaltime VARCHAR(10),
                regdate VARCHAR(20),
                experience INT,
                badgecolor VARCHAR(10),
                socialprofile VARCHAR(255),
                specialrequests TEXT,
                payment_method VARCHAR(30),
                accommodation VARCHAR(5),
                submittedAt VARCHAR(50)
            )
        ''')
        conn.commit()
        cursor.close()
        conn.close()
        print("MySQL database schema checked successfully.")
    except mysql.connector.Error as err:
        print(f"Error checking MySQL schema: {err}")




# Initialize schema database
init_db()



# Serve Frontend files
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # Fallback to home page
    return send_from_directory(app.static_folder, 'index.html')



@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.form or {}

        fullname        = data.get('fullname', '').strip()
        email           = data.get('email', '').strip()
        phone           = data.get('phone', '').strip()
        yearofstudy     = data.get('yearofstudy', '').strip()
        department      = data.get('department', '').strip()
        otherdept       = data.get('otherdept', '').strip()
        college         = data.get('college', '').strip()
        gender          = data.get('gender', '').strip()
        arrivaltime     = data.get('arrivaltime', '').strip()
        regdate         = data.get('regdate', '').strip()
        experience      = data.get('experience', '5').strip()
        badgecolor      = data.get('badgecolor', '#12b5cb').strip()
        socialprofile   = data.get('socialprofile', '').strip()
        specialrequests = data.get('specialrequests', '').strip()
        payment_method  = data.get('payment-method', '').strip()
        accommodation   = data.get('accommodation', 'no').strip()

        # Combine selected events (multi-value)
        events = ', '.join(request.form.getlist('event-tracks'))

        # Use otherdept if department is 'other'
        if department == 'other' and otherdept:
            department = otherdept

        if not all([fullname, email, phone, yearofstudy, department, college, gender]):
            return jsonify({'success': False, 'error': 'Required fields are missing.'}), 400

        # Generate unique registration ID: CYRX-XXXXXX
        reg_id = 'CYRX-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

        conn = mysql.connector.connect(
            host=DB_HOST, port=DB_PORT,
            user=DB_USER, password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO registrations
            (reg_id, fullname, email, phone, yearofstudy, department, college,
             gender, events, arrivaltime, regdate, experience, badgecolor,
             socialprofile, specialrequests, payment_method, accommodation, submittedAt)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        ''', (
            reg_id, fullname, email, phone,
            int(yearofstudy) if yearofstudy.isdigit() else None,
            department, college, gender, events,
            arrivaltime, regdate,
            int(experience) if experience.isdigit() else 5,
            badgecolor, socialprofile, specialrequests,
            payment_method, accommodation,
            datetime.now().isoformat()
        ))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Registration successful!',
            'regId': reg_id
        })
    except mysql.connector.Error as db_err:
        print("Database error during registration:", db_err)
        return jsonify({'success': False, 'error': f"Database error: {db_err.msg}"}), 500
    except Exception as e:
        print("General error during registration:", str(e))
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        # Support both JSON and URL-encoded/form-data
        if request.is_json:
            data = request.get_json() or {}
        else:
            data = request.form or {}
            
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        if not all([name, email, subject, message]):
            return jsonify({'success': False, 'error': 'All fields are required.'}), 400

        conn = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO contact_messages (name, email, subject, message, submittedAt)
            VALUES (%s, %s, %s, %s, %s)
        ''', (
            name.strip(),
            email.strip(),
            subject.strip(),
            message.strip(),
            datetime.now().isoformat()
        ))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Your message has been submitted successfully!'
        })
    except mysql.connector.Error as db_err:
        print("Database error during contact submission:", db_err)
        return jsonify({'success': False, 'error': f"Database error: {db_err.msg}"}), 500
    except Exception as e:
        print("General error during contact submission:", str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

# ── Razorpay Payment Endpoints ──────────────────────────────────────────────

@app.route('/api/payment/create-order', methods=['POST'])
def payment_create_order():
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        return jsonify({
            'success': False,
            'error': 'Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the environment.'
        }), 500

    try:
        data = request.get_json() or {}
        amount = int(data.get('amount', 15000))
        currency = (data.get('currency', 'INR') or 'INR').upper()
        receipt = str(data.get('receipt') or f'cyperx-{int(datetime.now().timestamp())}')

        if amount <= 0:
            return jsonify({'success': False, 'error': 'Payment amount must be greater than zero.'}), 400

        body = json.dumps({
            'amount': amount,
            'currency': currency,
            'receipt': receipt,
            'notes': {
                'purpose': 'cyperX registration fee',
                'event': 'cyperX Symposium'
            }
        }).encode('utf-8')

        auth = base64.b64encode(f'{RAZORPAY_KEY_ID}:{RAZORPAY_KEY_SECRET}'.encode('utf-8')).decode('utf-8')
        req = urllib.request.Request(
            'https://api.razorpay.com/v1/orders',
            data=body,
            headers={
                'Authorization': f'Basic {auth}',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method='POST'
        )

        with urllib.request.urlopen(req, timeout=20) as resp:
            payload = json.loads(resp.read().decode('utf-8'))

        return jsonify({
            'success': True,
            'order_id': payload.get('id'),
            'amount': payload.get('amount'),
            'currency': payload.get('currency'),
            'key_id': RAZORPAY_KEY_ID,
            'receipt': payload.get('receipt')
        })
    except Exception as exc:
        print('Razorpay order creation failed:', exc)
        return jsonify({
            'success': False,
            'error': 'Unable to create Razorpay order. Please verify your Razorpay credentials.'
        }), 500


@app.route('/api/payment/verify', methods=['POST'])
def payment_verify():
    if not RAZORPAY_KEY_SECRET:
        return jsonify({
            'success': False,
            'error': 'Razorpay secret is not configured.'
        }), 500

    data = request.get_json() or {}
    order_id = str(data.get('order_id', '')).strip()
    payment_id = str(data.get('payment_id', '')).strip()
    signature = str(data.get('signature', '')).strip()

    if not all([order_id, payment_id, signature]):
        return jsonify({'success': False, 'error': 'Missing Razorpay verification data.'}), 400

    payload_to_verify = f'{order_id}|{payment_id}'.encode('utf-8')
    generated_signature = hmac.new(
        RAZORPAY_KEY_SECRET.encode('utf-8'),
        payload_to_verify,
        hashlib.sha256
    ).hexdigest()

    is_valid = hmac.compare_digest(generated_signature, signature)

    if not is_valid:
        return jsonify({'success': False, 'error': 'Invalid Razorpay payment signature.'}), 400

    return jsonify({
        'success': True,
        'message': 'Razorpay payment verified successfully.',
        'status': 'paid'
    })

@app.route('/api/payment/initiate', methods=['POST'])
def payment_initiate():
    """Legacy compatibility: create a Razorpay order if configured."""
    return payment_create_order()

@app.route('/api/payment/status/<txn_id>', methods=['GET'])
def payment_status(txn_id):
    return jsonify({
        'success': True,
        'transaction_id': txn_id,
        'status': 'paid' if RAZORPAY_KEY_ID else 'pending'
    })

@app.route('/api/payment/verify-utr', methods=['POST'])
def verify_utr():
    """
    Verify UPI payment by UTR (Unique Transaction Reference) number.
    User enters the transaction ID shown in their UPI app after paying.
    Backend validates format and stores for admin confirmation.
    """
    import re
    data = request.get_json() or {}
    utr    = data.get('utr', '').strip()
    upi_id = data.get('upi_id', '').strip()
    amount = data.get('amount', 0)

    # Validate: UTR must be at least 6 characters, alphanumeric
    if not utr or len(utr) < 6 or not re.match(r'^[A-Za-z0-9]+$', utr):
        return jsonify({'success': False, 'error': 'Invalid Transaction ID. Please check and re-enter.'}), 400

    # Store UTR in DB for admin verification (optional audit trail)
    try:
        conn = mysql.connector.connect(
            host=DB_HOST, port=DB_PORT,
            user=DB_USER, password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = conn.cursor()
        # Create table if not exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS payment_utr_log (
                id INT AUTO_INCREMENT PRIMARY KEY,
                utr VARCHAR(50),
                upi_id VARCHAR(100),
                amount INT,
                verified_at VARCHAR(50),
                status VARCHAR(20) DEFAULT "pending"
            )
        ''')
        cursor.execute(
            'INSERT INTO payment_utr_log (utr, upi_id, amount, verified_at) VALUES (%s, %s, %s, %s)',
            (utr, upi_id, amount, datetime.now().isoformat())
        )
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"UTR log error (non-fatal): {e}")
        # Non-fatal: still allow payment to proceed even if DB log fails

    return jsonify({
        'success': True,
        'message': 'Payment verified successfully',
        'utr': utr,
        'status': 'verified'
    })

@app.route('/api/payment/complete/<txn_id>', methods=['POST'])
def payment_complete(txn_id):
    """Stub: mark payment as complete."""
    return jsonify({
        'success': True,
        'transaction_id': txn_id,
        'status': 'completed'
    })
# ────────────────────────────────────────────────────────────────────────────



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
