import { Fragment } from "react";
import { useAppContext } from "@/contexts/app-context";
import { useModalContext } from "@/contexts/modal-context";
import { BsAppIndicator, BsChevronDown, BsCircleHalf } from "react-icons/bs";

import Modal from "@/components/modals/Modal";
import Dropdown from "@/components/Dropdown";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { updateUser } from "@/api/users";

export default function Preferences() {
  const { theme, auth, setTheme, setAuth } = useAppContext();
  const { closeModal } = useModalContext();

  const toggleActiveStatus = (status: boolean) => {
    updateUser(auth, { active_status: status }).then(() => {
      setAuth({ ...auth, active_status: status });
    });
  };

  return (
    <Modal>
      <Modal.Header title="설정" onClose={closeModal} />

      <Modal.Body className="flex" as={Fragment}>
        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-sm">
            <BsCircleHalf />
            테마
          </div>
          <Dropdown>
            <Dropdown.Trigger>
              <button className="btn btn-secondary flex items-center gap-2">
                {theme == "dark"
                  ? "다크모드"
                  : theme == "light"
                    ? "라이트모드"
                    : "시스템"}
                <BsChevronDown />
              </button>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <Dropdown.Button onClick={() => setTheme("system")}>
                시스템
              </Dropdown.Button>
              <Dropdown.Button onClick={() => setTheme("dark")}>
                다크모드
              </Dropdown.Button>
              <Dropdown.Button onClick={() => setTheme("light")}>
                라이트모드
              </Dropdown.Button>
            </Dropdown.Content>
          </Dropdown>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-sm">
            <BsAppIndicator />
            온라인상태
          </div>

          <Switch
            checked={auth.active_status}
            onChange={toggleActiveStatus}
            className={clsx(
              "relative inline-flex h-6 w-11 items-center rounded-md",
              auth.active_status ? "bg-primary" : "bg-secondary",
            )}
          >
            <span className="sr-only">온라인상태 활성화</span>
            <span
              className={`${
                auth.active_status ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-md bg-white transition`}
            />
          </Switch>
        </div>
      </Modal.Body>
    </Modal>
  );
}
