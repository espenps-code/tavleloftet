/* Krøniken – Firebase-oppsett (samme prosjekt som resten av Tavleloftet).
   Nøkkelen er offentlig og skal ligge her. Det er databasereglene som beskytter dataene.
   Quizspillet bruker stien quiz/<KODE> i Realtime Database. Står denne som null, kjører quizen i testmodus på én maskin. */
window.TAVLELOFTET_FIREBASE = {
  apiKey: "AIzaSyDKUuvyvZ7o85j4gLTvo5KD0ZrSf0fcbKM",
  authDomain: "tavleloftet.firebaseapp.com",
  databaseURL: "https://tavleloftet-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tavleloftet",
  appId: "1:241109019628:web:a7bc7e79e8205a7d796ec9"
};
