import ContactButton from "@/components/contact-form/contact-button";

export default function Contact() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl p-8 rounded-lg bg-transparent border-2 border-gray-200">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Contact Me
          </h1>
          <p className="mt-4 text-lg text-center text-gray-600">
            If you have any questions, feel free to reach out.
          </p>

          <div className="mt-8">
            <ContactButton />
          </div>
        </div>
      </div>
    </>
  );
}
