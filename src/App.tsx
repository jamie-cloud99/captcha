import Captcha from "@/components/Captcha";
import { useState } from "react";

function App() {
  const [shouldCheckCaptcha, setShouldCheckCaptcha] = useState(false);

  function submit(e) {
    e.preventDefault();
    console.log("submitted");
    setShouldCheckCaptcha(true);
  }

  return (
    <>
      <main className="container mx-auto p-8">
        <h2 className="mb-4 text-3xl">captcha test</h2>
        <form className="flex w-[400px] flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="username"
            className="rounded border border-stone-500 p-1"
          />

          <div className="flex gap-4">
            <Captcha
              distortionAmount={3}
              shouldCheckCaptcha={shouldCheckCaptcha}
              setShouldCheckCaptcha={setShouldCheckCaptcha}
            />
          </div>

          <button
            onClick={submit}
            className="rounded bg-green-500 px-2 py-1 text-white hover:bg-green-400 focus:bg-green-600"
          >
            Submit
          </button>
        </form>
      </main>
    </>
  );
}

export default App;
