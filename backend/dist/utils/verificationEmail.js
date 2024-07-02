import { Resend } from 'resend';
const resend = new Resend('re_Gtd8ELg5_PxoDBFit3CjNJC2BkrMTsaNF');
export async function sendVerificationEmail(email, username) {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: `${email}`,
            subject: 'Welcome To Jain Ecommerce',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jain Ecommerce - Welcome Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      border: 1px solid #ddd;
    }
    .header {
      text-align: center;
    }
    .logo {
      width: 150px;
      height: auto;
      margin: 0 auto;
    }
    .content {
      padding: 20px 0;
    }
    .cta {
      text-align: center;
      margin-top: 20px;
    }
    .cta a {
      display: inline-block;
      padding: 10px 20px;
      background-color: #f05a28;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <img src="https://cdn-sharing.adobecc.com/composite/component/id/urn:aaid:sc:AP:b5842102-e71a-415b-9e71-4f2d0a663aa8?component_id=f5001eff-0dc8-4a17-8efc-f1d42732b0db&revision=e93f17a2-6a7a-4aa2-ade8-632de8ee377a&api_key=projectx_webapp&access_token=1719987817_urn%3Aaaid%3Asc%3AAP%3Ab5842102-e71a-415b-9e71-4f2d0a663aa8%3Bpublic_9da36a54ec86cae6f5c034f1775840457a032fe0" alt="Jain Ecommerce Logo" class="logo">
    </header>
    <div class="content">
      <h1>Welcome to Jain Ecommerce, ${username}!</h1>
      <p>Thanks for joining the Jain Ecommerce family! We're thrilled to welcome you and can't wait for you to discover our amazing selection of products.</p>
      <p>As a thank you for signing up, here's a special discount code/free shipping offer for your first purchase. Just use the code FIRST at checkout.</p>
    </div>
    <footer>
      <p>Happy shopping!</p>
      <p>The Jain Ecommerce Team</p>
    </footer>
  </div>
</body>
</html>
`,
        });
        return { success: true, message: "Send email Successful" };
    }
    catch (error) {
        return console.error({ error });
    }
}
;
