import React, { useEffect, useState } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Spinner, Center } from "@chakra-ui/react";


function MyComponent() {
  const [loading, setLoading] = useState(true);

  return (
    <GoogleReCaptchaProvider reCaptchaKey="6Lc5RpkoAAAAAFVlIPRW-5fo1hQmPkwUpVmfxuEa">
      <MyInnerComponent setLoading={setLoading} />
      {loading && (
        <Center>
          <Spinner size="xl" />
        </Center>
      )}
    </GoogleReCaptchaProvider>
  );
}

function MyInnerComponent({ setLoading }) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    const getToken = async () => {
      if (executeRecaptcha) {
        const token = await executeRecaptcha();
        console.log("Token:", token);

        try {
            const response = await fetch("http://localhost:8080/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: token }),
            });
  
            const data = await response.json();
            console.log("Response:", data);
          } catch (error) {
            console.error("Failed:", error);
          }
        
        setLoading(false);
      }
    };

    setTimeout(() => {
      getToken();
    }, 5000);
  }, [executeRecaptcha, setLoading]);

  return null;
}

export default MyComponent;
