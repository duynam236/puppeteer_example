var querystring = require("querystring");
var http = require("http");
var fs = require("fs");

const sendEmail = {
  async SendEmailTemplate(template, email_id) {
    let text_data = fs.readFileSync(`./${template}/${template}_inlinecss.html`);

    const data = {
      touchpoint: {
        channel: "email",
        source: "email",
        id: "nam.test.subiz@gmail.com",
      },
      by: {
        id: "agrjulxtzdhhwabuym",
        type: "agent",
      },
      data: {
        message: {
          text: text_data.toString(),
          format: "html",
          fields: [
            {
              value: '"support@subiz.com"',
              key: "from",
            },
            {
              value: '["nam.test.subiz@gmail.com"]',
              key: "to",
            },
            {
              value: "[]",
              key: "ccs",
            },
            {
              value: `"${email_id}"`,
              key: "subject",
            },
          ],
          tos: ["usrseljdmkwzrevmnitmq"],
        },
      },
      type: "message_sent",
    };
    console.log("Start send", template);
    const response = await fetch(
      "https://api.subiz.com.vn/4.0/messages?x-access-token=acpxkgumifuoofoosble_agrjulxtzdhhwabuym_AKrtrselmbmambkhohrtvteuagxplgceqrctjgdxihsxkbc",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ).then(async (response) => {
      console.log("JSONNNNNN");
      var body = await response.json();
      return body;
    });
    console.log("end send", template);
  },
};

module.exports = sendEmail;
