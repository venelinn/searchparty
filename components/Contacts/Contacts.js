import React, { useState } from "react";
import styles from  "./Contacts.module.scss";

const encode = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

const Contacts = (props) => {
	const [status, setStatus] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(false);

  const handleSubmit = (e) => {
    const data = { "form-name": "contact", name, email, message };
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode(data),
    })
      .then(handleSuccess(true))
      .catch((error) => handleSuccess(false));

    e.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      return setName(value);
    }
    if (name === "email") {
      return setEmail(value);
    }
    if (name === "message") {
      return setMessage(value);
    }
  };

  const handleSuccess = (status) => {
    setStatus(status);
    setModal(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => {
      setModal(false);
    }, 5000);
  };

  return (
    <div className={styles["contact-form"]}>
      <form
        name="contact"
        onSubmit={handleSubmit}
        data-netlify="true"
        data-netlify-honeypot="bot"
        overlay={setModal}
        onClick={() => setModal(false)}
      >
        <input aria-label="form-name" type="hidden" name="form-name" value="contact" />
        <p hidden>
          <label>
            Don’t fill this out: <input name="bot" aria-label="bot" onChange={handleChange} />
          </label>
        </p>

        <p className={styles["form-field"]}>
          <label>
            <span>Name</span>
            <input
              value={name}
              onChange={handleChange}
              aria-label="Name"
              required
              name="name"
              type="text"
              placeholder="Name"
              minLength="2"
            />
          </label>
        </p>
        <p className={styles["form-field"]}>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              aria-label="Email"
              value={email}
              onChange={handleChange}
              required
              placeholder="Email"
            />
          </label>
        </p>
        <p className={styles["form-field"]}>
          <label>
            <span>Message</span>
            <textarea
              name="message"
              placeholder="Message"
              value={message}
              aria-label="Message"
              onChange={handleChange}
              required
              rows="5"
              cols="5"
            ></textarea>
          </label>
        </p>
        <p className={styles["form-field"]}>
          <button className="submitform" type="submit">
            Send
          </button>
        </p>
        <dialog open={modal} status={status} className={styles["contact-dialog"]}>
          <p>
            {status
              ? props.message
              : props.errorMessage}
          </p>
        </dialog>
      </form>
    </div>
  );
};

export default Contacts;
export { Contacts };
