const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendWelcomeMail = (email, name) => {
  const msg = {
    to: email,
    from: "burhanuddinsavli@gmail.com",
    subject: "Welcome Greetings",
    text: `Thank you ${name} for Signing-Up on our platform`,
  };

  sgMail
    .send(msg)
    .then(() => console.log("Sent Welcome Email"))
    .catch(console.log);
};

exports.sendLeavingMail = (email, name) => {
  const msg = {
    to: email,
    from: "burhanuddinsavli@gmail.com",
    subject: "Leaving So Soon :(",
    text: `${name} you have recently closed your account with us . \nYou can always rejoin :) . \nWe wish you the best`,
  };

  sgMail
    .send(msg)
    .then(() => console.log("Sent Leaving Email"))
    .catch(console.log);
};
