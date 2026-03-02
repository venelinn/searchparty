"use client";

import type { FC } from "react";
import { useState } from "react";
import { Button } from "../Button/Button";
import styles from "./Contacts.module.scss";

type ContactsProps = Record<string, never>;

const Contacts: FC<ContactsProps> = () => {
  const [status, setStatus] = useState<null | "pending" | "ok" | "error">(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setStatus("pending");
      setError(null);
      const myForm = event.target as HTMLFormElement;
      const formData = new FormData(myForm);
      const params = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        if (typeof value === "string") params.append(key, value);
      }
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      if (res.status === 200) {
        setStatus("ok");
      } else {
        setStatus("error");
        setError(`${res.status} ${res.statusText}`);
      }
    } catch (e) {
      setStatus("error");
      setError(`${e}`);
    }
  };

  return (
    <div className={styles["contact-form"]}>
      <form name="feedback" onSubmit={handleFormSubmit}>
        <input type="hidden" name="form-name" value="feedback" />
        {/* <input name="name" type="text" placeholder="Name" required  /> */}
				<p className={styles["form-field"]}>
          <label>
            <span>Name</span>
            <input
              aria-label="Name"
              required
              name="name"
              type="text"
              placeholder="Name"
              minLength={2}
            />
          </label>
        </p>
        {/* <input name="email" type="text" placeholder="Email (optional)" className="input input-bordered" /> */}
				<p className={styles["form-field"]}>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              aria-label="Email"
              required
              placeholder="Email"
            />
          </label>
        </p>
        {/* <input name="message" type="text" placeholder="Message" required  /> */}
				<p className={styles["form-field"]}>
          <label>
            <span>Message</span>
            <textarea
              name="message"
              placeholder="Message"
              aria-label="Message"
              required
              rows={5}
              cols={5}
            ></textarea>
          </label>
        </p>
        <p className={styles["form-field"]}>
          <Button
						variant="primary"
						size="md"
						type="submit"
						label="Submit"
						disabled={status === "pending"}
						/>

        </p>
        {status === "ok" && (
          <div className="alert alert-success">
            Submitted!
          </div>
        )}
        {status === "error" && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default Contacts;
export { Contacts };