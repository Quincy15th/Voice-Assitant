from flask import Flask

from routes.stt_routes import stt_bp
from routes.tts_routes import tts_bp
from routes.intent_routes import intent_bp
from routes.faq_routes import faq_bp

app = Flask(__name__)

app.register_blueprint(stt_bp)
app.register_blueprint(tts_bp)
app.register_blueprint(intent_bp)
app.register_blueprint(faq_bp)
@app.route("/")
def home():

    return {
        "success": True,
        "message": "AI Service Running"
    }

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )