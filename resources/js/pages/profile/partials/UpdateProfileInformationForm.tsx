import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { ChangeEvent, FormEventHandler, useRef } from "react";
import { PageProps } from "@/types";
import { BsCamera } from "react-icons/bs";
import { UpdateProfileSchema } from "@/types/user";
import Dropdown from "@/components/Dropdown";
import { usePremium } from "@/hooks/use-premium";

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  friends,
  className = "",
}: {
  mustVerifyEmail: boolean;
  status?: string;
  friends:any;
  className?: string;
}) {
  const user = usePage<PageProps>().props.auth;
  const { currentPremium,remainedDays } = usePremium();
  const avatarRef = useRef<HTMLImageElement>(null);
  const jobs=["사장","기사"];
  const categories = ["운송","무역"];
  const capabilities = ["100","200"];
  const { data, setData, post, errors, processing, recentlySuccessful } =
    useForm<UpdateProfileSchema>({
      _method: "PATCH",
      name: user.name,
      phone: user.phone,
      avatar: null,
      gender: user.gender,
      age: user.age,
      country: user.country,
      city: user.city,
      company: user.company,
      job: user.job,
      category: user.category,
      capability: user.capability,
    });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("profile.update"));
  };

  const changeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setData("avatar", files[0]);

      const imageUrl = window.URL.createObjectURL(files[0]);
      avatarRef.current?.setAttribute("src", imageUrl);

      return () => {
        window.URL.revokeObjectURL(imageUrl);
      };
    }
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-foreground">개인정보</h2>

      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div className="picture relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="mx-auto h-20 w-20 rounded-full border border-secondary"
            ref={avatarRef}
          />

          <label
            htmlFor="avatar"
            className="btn btn-primary absolute left-1/2 top-6 flex translate-x-5 cursor-pointer items-center justify-center rounded-full px-2"
            tabIndex={0}
          >
            <BsCamera />
            <input
              type="file"
              onChange={changeAvatar}
              id="avatar"
              className="hidden"
            />
          </label>
        </div>
        {/* <div>
          <InputLabel htmlFor="balance" value="포인트잔액" />

          <TextInput
            id="balance"
            className="mt-1 block w-full"
            value={user.balance}
            readOnly
          />

          <InputError className="mt-2" message={errors.name} />
        </div> */}
        <div>
          <InputLabel htmlFor="name" value="이름" />

          <TextInput
            id="name"
            className="mt-1 block w-full"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
            isFocused
            autoComplete="name"
          />

          <InputError className="mt-2" message={errors.name} />
        </div>

        <div>
          <InputLabel htmlFor="phone" value="전화번호" />

          <TextInput
            id="phone"
            type="text"
            className="mt-1 block w-full"
            value={data.phone}
            onChange={(e) => setData("phone", e.target.value)}
            required
            autoComplete="phone"
          />

          <InputError className="mt-2" message={errors.phone} />
        </div>
        <div>
          <InputLabel htmlFor="gender" value="성별" />
      
          <Dropdown>
            <Dropdown.Trigger>
              <button className="btn btn-secondary flex items-center gap-2 w-full " onClick={(e)=>e.preventDefault()}>
                {data.gender||"성별"}
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
              
                <Dropdown.Button onClick={(e) => {e.preventDefault();setData("gender", "남성")}}>
                  남성
                </Dropdown.Button>
                <Dropdown.Button onClick={(e) => {e.preventDefault();setData("gender", "여성")}}>
                  여성
                </Dropdown.Button>
            </Dropdown.Content>
          </Dropdown>
          <InputError className="mt-2" message={errors.gender} />
        </div>
        <div>
          <InputLabel htmlFor="age" value="년령" />
          <TextInput
            id="age"
            type="number"
            className="mt-1 block w-full"
            value={data.age}
            onChange={(e) => setData("age", parseInt(e.target.value))}
            autoComplete="age"

          />
          <InputError className="mt-2" message={errors.age} />
        </div>
        <div>
          <InputLabel htmlFor="country" value="국가" />
          <TextInput
            id="country"
            type="text"
            className="mt-1 block w-full"
            value={data.country}
            onChange={(e) => setData("country", e.target.value)}
            autoComplete="country"

          />
          <InputError className="mt-2" message={errors.country} />
        </div>
        <div>
          <InputLabel htmlFor="city" value="도시" />
          <TextInput
            id="city"
            type="text"
            className="mt-1 block w-full"
            value={data.city}
            onChange={(e) => setData("city", e.target.value)}
            autoComplete="city"

          />
          <InputError className="mt-2" message={errors.city} />
        </div>
        <div>
          <InputLabel htmlFor="company" value="회사명" />
          <TextInput
            id="company"
            type="text"
            className="mt-1 block w-full"
            value={data.company}
            onChange={(e) => setData("company", e.target.value)}
            autoComplete="company"

          />
          <InputError className="mt-2" message={errors.company} />
        </div>
        <div>
          <InputLabel htmlFor="job" value="회사직책" />
          <Dropdown>
            <Dropdown.Trigger>
              <button className="btn btn-secondary flex items-center gap-2 w-full " onClick={(e)=>e.preventDefault()}>
                {data.job||"회사직책"}
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
                {jobs.map((job)=>(
                  <Dropdown.Button key={job} onClick={(e) => {e.preventDefault();setData("job",job)}}>
                    {job}
                  </Dropdown.Button>
                ))}
            </Dropdown.Content>
          </Dropdown>
          <InputError className="mt-2" message={errors.job} />
        </div>
        <div>
          <InputLabel htmlFor="category" value="무역종류" />
          <Dropdown>
            <Dropdown.Trigger>
              <button className="btn btn-secondary flex items-center gap-2 w-full " onClick={(e)=>e.preventDefault()}>
                {data.category||"무역종류"}
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
                {categories.map((category)=>(
                  <Dropdown.Button key={category} onClick={(e) => {e.preventDefault();setData("category",category)}}>
                    {category}
                  </Dropdown.Button>
                ))}
            </Dropdown.Content>
          </Dropdown>
          <InputError className="mt-2" message={errors.category} />
        </div>
        <div>
          <InputLabel htmlFor="capability" value="무역범위" />
          <Dropdown>
            <Dropdown.Trigger>
              <button className="btn btn-secondary flex items-center gap-2 w-full " onClick={(e)=>e.preventDefault()}>
                {data.capability||"무역범위"}
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
                {capabilities.map((capability)=>(
                  <Dropdown.Button key={capability} onClick={(e) => {e.preventDefault();setData("capability",capability)}}>
                    {capability}
                  </Dropdown.Button>
                ))}
            </Dropdown.Content>
          </Dropdown>
          <InputError className="mt-2" message={errors.capability} />
        </div>
        {/* {mustVerifyEmail && user.phone_verified_at === null && (
          <div>
            <p className="mt-2 text-sm text-foreground">
              귀하의 이메일 주소가 검증되지 않았습니다.
              <Link
                href={route("verification.send")}
                method="post"
                as="button"
                className="btn btn-secondary"
              >
                여기를 클릭하여 확인 이메일을 다시 보내세요.
              </Link>
            </p>

            {status === "verification-link-sent" && (
              <div className="mt-2 text-sm font-medium text-success">
                귀하의 이메일 주소로 새로운 확인 링크가 전송되었습니다.
              </div>
            )}
          </div>
        )} */}

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing} className="w-full bg-[forestgreen]">저장</PrimaryButton>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-foreground">저장됨.</p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
