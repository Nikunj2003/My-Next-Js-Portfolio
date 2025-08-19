import { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import CustomInput from "@/components/utility/custom-input";
import CustomTextarea from "@/components/utility/custom-textarea";
import ContactMailToast from "@/components/contact-form/contact-mail-toast";
import {
  FormikSubmitHandler,
  type FormiKInputFieldProps,
} from "@/utility/types";
import { type MailSentToastState } from "@/components/contact-form/contact-mail-toast";

export const mailValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email required"),
  name: Yup.string().required("Name required"),
  subject: Yup.string().required("Subject required"),
  message: Yup.string().required("Message required"),
  // Honeypot: must remain empty; bots filling it will fail validation
  website: Yup.string().max(0),
});

export type ContactFormValues = Yup.InferType<typeof mailValidationSchema>;

const initialFormValues: ContactFormValues = {
  email: "",
  name: "",
  message: "",
  subject: "",
  website: "", // honeypot
};

export default function ContactForm() {
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [toastState, setToastState] = useState<MailSentToastState>({
    type: null,
    value: false,
  });

  const handleSubmit = async (
    values: Yup.InferType<typeof mailValidationSchema>,
    { resetForm }: FormikSubmitHandler
  ) => {
    setIsSendingMail(true);
    try {
      const response = await fetch("/api/sendmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setToastState({ type: "PASS", value: true });
        resetForm();
      } else {
        setToastState({
          type: response.status === 429 ? "RATE_LIMIT" : "FAIL",
          value: true,
        });
      }
    } catch {
      setToastState({
        type: "FAIL",
        value: true,
      });
    }
    setIsSendingMail(false);
  };

  return (
    <>
      <Formik
        initialValues={initialFormValues}
        validationSchema={mailValidationSchema}
        onSubmit={handleSubmit}
        validateOnChange
      >
        {({ isValid }) => (
          <Form className="mt-8 flex flex-col gap-6">
            {/* Hidden honeypot field for spam mitigation */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <Field
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            {/** Email Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold uppercase tracking-wider text-foreground"
              >
                Email Address
              </label>
              <Field name="email">
                {({ field, meta }: FormiKInputFieldProps<string>) => (
                  <>
                    <CustomInput
                      id="email"
                      {...field}
                      type="email"
                      placeholder="Enter your email address"
                      className="h-12 border border-border bg-muted text-foreground transition-colors placeholder:text-muted-foreground focus:border-accent focus:bg-background"
                    />
                    {Boolean(meta.touched && meta.error) && (
                      <span className="mt-1 text-xs font-medium text-destructive">
                        {meta.error}
                      </span>
                    )}
                  </>
                )}
              </Field>
            </div>

            {/** Name Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold uppercase tracking-wider text-foreground"
              >
                Full Name
              </label>
              <Field name="name">
                {({ field, meta }: FormiKInputFieldProps<string>) => (
                  <>
                    <CustomInput
                      id="name"
                      {...field}
                      type="text"
                      placeholder="Enter your full name"
                      className="h-12 border border-border bg-muted text-foreground transition-colors placeholder:text-muted-foreground focus:border-accent focus:bg-background"
                    />
                    {Boolean(meta.touched && meta.error) && (
                      <span className="mt-1 text-xs font-medium text-destructive">
                        {meta.error}
                      </span>
                    )}
                  </>
                )}
              </Field>
            </div>

            {/** Subject Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="subject"
                className="text-sm font-semibold uppercase tracking-wider text-foreground"
              >
                Subject
              </label>
              <Field name="subject">
                {({ field, meta }: FormiKInputFieldProps<string>) => (
                  <>
                    <CustomInput
                      id="subject"
                      {...field}
                      type="text"
                      placeholder="What would you like to discuss?"
                      className="h-12 border border-border bg-muted text-foreground transition-colors placeholder:text-muted-foreground focus:border-accent focus:bg-background"
                    />
                    {Boolean(meta.touched && meta.error) && (
                      <span className="mt-1 text-xs font-medium text-destructive">
                        {meta.error}
                      </span>
                    )}
                  </>
                )}
              </Field>
            </div>

            {/** Message Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-sm font-semibold uppercase tracking-wider text-foreground"
              >
                Message
              </label>
              <Field name="message">
                {({ field, meta }: FormiKInputFieldProps<string>) => (
                  <>
                    <CustomTextarea
                      id="message"
                      {...field}
                      placeholder="Tell me about your project or idea..."
                      rows={5}
                      className="resize-none border border-border bg-muted text-foreground transition-colors placeholder:text-muted-foreground focus:border-accent focus:bg-background"
                    />
                    {Boolean(meta.touched && meta.error) && (
                      <span className="mt-1 text-xs font-medium text-destructive">
                        {meta.error}
                      </span>
                    )}
                  </>
                )}
              </Field>
            </div>

            {/** Submit Button */}
            <button
              aria-label="Send message"
              type="submit"
              className="mt-6 w-full rounded-xl bg-accent px-6 py-4 text-center text-lg font-semibold text-accent-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              disabled={!isValid || isSendingMail}
            >
              {isSendingMail ? (
                <div className="inline-flex items-center gap-4">
                  <span className="h-4 w-4">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="100%"
                      width="100%"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z">
                        <animateTransform
                          attributeName="transform"
                          attributeType="XML"
                          type="rotate"
                          dur="1s"
                          from="0 12 12"
                          to="360 12 12"
                          repeatCount="indefinite"
                        />
                      </path>
                    </svg>
                  </span>
                  <span>Sending</span>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </Form>
        )}
      </Formik>
      <ContactMailToast toastState={toastState} showToast={setToastState} />
    </>
  );
}
