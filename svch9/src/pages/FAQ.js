import { Accordion } from 'react-bootstrap';

function FAQ() {

  return (
    <div className="faq">
      <h1>Frequently Asked Questions</h1>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>What is React?</Accordion.Header>
          <Accordion.Body>
            React is a JavaScript library for building user interfaces. It allows 
            you to build reusable UI components and manage state efficiently.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>What is Bootstrap?</Accordion.Header>
          <Accordion.Body>
            Bootstrap is a popular CSS framework for developing responsive, 
            mobile-first web sites. React Bootstrap allows you to use Bootstrap 
            in React applications.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>How do I contact support?</Accordion.Header> 
          <Accordion.Body>
            You can reach our customer support team Monday to Friday 
            from 9am - 5pm EST at <a href="mailto:support@company.com">
            support@company.com</a>.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

    </div>
  );
}

export default FAQ;