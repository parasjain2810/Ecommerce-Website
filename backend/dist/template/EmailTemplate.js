import { Html, Head, Font, Heading, Row, Section, Text, } from '@react-email/components';
export default function EmailTemplate({ username }) {
    return (<Html lang="en" dir="ltr">
        <Head>
          <Font fontFamily="Roboto" fallbackFontFamily="Verdana" webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
        }} fontWeight={400} fontStyle="normal"/>
        </Head>
        <Section>
          <Row>
            <Heading as="h2">Welcome to Jain Ecommerce!</Heading>
          </Row>
          <Row>
            <Text>
            Hi {username},
            Thanks for joining the Jain Ecommerce family! We're thrilled to welcome you and can't wait for you to discover our amazing selection of products.As a thank you for signing up, here's a special  for your first purchase. Just use the code [CODE] at checkout.
            <br />
            Happy shopping!
            <br />
            The Jain Ecommerce Team
            </Text>
          </Row>
          <Row>
            <Text>
              Contact with email: <a href="mailto:parashjain2810@gmail.com">parashjain2810@gmail.com</a>
               <br />
               Contact with number: <p>7457018556</p>
            </Text>
          </Row>
        </Section>
      </Html>);
}
