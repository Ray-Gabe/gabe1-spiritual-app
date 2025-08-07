from flask import Flask, render_template, jsonify

app = Flask(__name__)
app.secret_key = "test-key"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/gamified/prayer_training', methods=['POST'])
def prayer_training():
    return jsonify({'success': True, 'message': 'Prayer training completed!'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
