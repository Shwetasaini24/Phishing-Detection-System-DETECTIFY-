from flask import Flask, render_template, request
import pickle
import re

app = Flask(__name__)
vector = pickle.load(open("vectorizer.pkl", 'rb'))
model = pickle.load(open("phishing.pkl", 'rb'))

@app.route("/",methods=['GET','POST'])
def index():
    predict = ""
    if request.method =="POST":
        url = request.form['url'].strip()
        cleaned_url = re.sub(r'^https?://(www\.)?', '', url)
        print("Cleaned URL:", cleaned_url)       
        predict = model.predict(vector.transform([cleaned_url]))[0]

        if predict == 'bad':
          predict = "🚨 This is a PHISHING Website! DANGER!"
        elif predict == 'good':
         predict = "✅ This is a Healthy & Safe Website!"
        else:
         predict = "⚠️ Something went wrong! Try again."
    
    return render_template("index.html", predict=predict)

if __name__=="__main__":
    app.run(debug=True)