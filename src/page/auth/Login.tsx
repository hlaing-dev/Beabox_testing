import { paths } from "@/routes/paths";
import { ChevronLeft, Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { LoginFormData, loginSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useGetCaptchaMutation, useLoginMutation } from "@/store/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/persistSlice";
import loader from "@/page/home/vod_loader.gif";
import Loader from "@/components/shared/loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SmallLoader from "@/components/shared/small-loader";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading,  error: lerror }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [getCaptcha, { data, isLoading: captchaLoading }] =
    useGetCaptchaMutation();
  const [show验证码, setShow验证码] = useState(false);
  console.log(data);
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const { watch } = form;
  const emailOrPhoneValue = watch("emailOrPhone");
  const passwordValue = watch("password");

  async function onSubmit() {
    if (data?.status) setShow验证码(true);
  }
  const handleVerify = async (e: any) => {
    // Add 验证码 logic here
    e.stopPropagation();
    const { emailOrPhone, password } = form.getValues();
    console.log(emailOrPhone, password);
    const { data: loginData } = await login({
      username: emailOrPhone,
      password,
      captcha,
      captcha_key: data?.data?.captcha_key,
    });
    console.log(loginData, "loginData");
    if (loginData?.status) {
      dispatch(setUser(loginData?.data));
      setShow验证码(false);
      navigate(paths.profile);
    } else {
      setShow验证码(false);
      setError("出了点问题");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

    useEffect(() => {
      setError(lerror?.data?.message);
    }, [lerror]);
  

  return (
    <>
      {isLoading || captchaLoading ? <Loader /> : <></>}
      <div className="px-5 h-screen bg-[#FFFFFF1F]">
        <div className="flex justify-between items-center py-5">
          <button onClick={handleBack}>
            <ChevronLeft />
          </button>
          <p className="text-[16px]">Login</p>
          <div></div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 py-10"
          >
            <FormField
              control={form.control}
              name="emailOrPhone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <label htmlFor="" className="text-[14px] text-[#888]">
                        密码
                      </label>
                      <div className="relative">
                        <input
                          className="block w-full py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none "
                          placeholder="输入用户名"
                          {...field}
                        />
                        {field.value && (
                          <div
                            className="w-6 h-6 rounded-full flex justify-center items-center bg-[#FFFFFF1F] absolute right-0 bottom-2"
                            onClick={() => {
                              field.onChange("");
                            }}
                          >
                            <X size={9} />
                          </div>
                        )}
                        <div className="w-full h-[1px] bg-[#FFFFFF0A]"></div>
                      </div>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <>
                      <label htmlFor="" className="text-[14px] text-[#888]">
                        密码
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="block w-full py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none "
                          placeholder="输入您的密码"
                          {...field}
                        />
                        <button
                          className=" absolute right-0 bottom-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPassword(!showPassword);
                          }}
                        >
                          {showPassword ? (
                            <Eye className="w-[18px]" />
                          ) : (
                            <EyeOff className="w-[18px]" />
                          )}
                        </button>

                        <div className="w-full h-[1px] bg-[#FFFFFF0A]"></div>
                      </div>
                    </>
                  </FormControl>
                  <FormMessage />
                  {/* <FormMessage>{error}</FormMessage> */}
                </FormItem>
              )}
            />

            <h1 className="mt-4 text-red-500 text-sm">{error}</h1>

            <div className="">
              {/* <SubmitButton
                isLoading={isLoading}
                condition={true}
                text={"Login"}
              /> */}
              <Button
                disabled={
                  isLoading ||
                  captchaLoading ||
                  !emailOrPhoneValue ||
                  !passwordValue
                }
                // type="submit"
                onClick={async () => {
                  await getCaptcha("");
                  setShow验证码(true);
                }}
                className="w-full gradient-bg rounded-lg hover:gradient-bg"
              >
                {/* {isLoading ? "loading..." : "Login"} */}
                {captchaLoading ? <SmallLoader /> : "登录"}
              </Button>
              <Link to={paths.forgot_password}>
                <p className="text-center text-[14px] mt-5">Forgot Password?</p>
              </Link>
            </div>
            <Dialog open={show验证码} onOpenChange={setShow验证码}>
              {!captchaLoading ? (
                <DialogContent className="bg-[#16131C] border-0 shadow-lg rounded-lg max-w-[320px]">
                  <DialogHeader>
                    <DialogTitle className="text-white text-[16px]">
                      验证码
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 w-full">
                    <div className="flex justify-center items-center gap-1 h-[36px]">
                      <input
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        placeholder="Type Captcha"
                        className="bg-[#2D2738] w-[70%] px-[10px] h-full outline-none"
                      />

                      <img
                        src={data?.data?.img}
                        className="w-[30%]  h-full  object-center outline-none border-gray-400"
                        alt=""
                      />
                    </div>
                    <Button
                      onClick={handleVerify}
                      disabled={isLoading ? true : false || !captcha?.length}
                      type="submit"
                      className="w-full gradient-bg hover:gradient-bg text-white rounded-lg"
                    >
                      {/* {registerLoading ? "loading..." : "Verify"} */}
                      {isLoading ? (
                        <img src={loader} alt="" className="w-12" />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              ) : (
                <></>
              )}
            </Dialog>
            <div className="w-full flex flex-col items-center">
              <p className="text-[14px] text-[#333333] text-center mb-5">OR</p>
              <Link to={paths.regiter}>
                <Button
                  className="w-[320px] bg-transparent"
                  variant={"outline"}
                >
                  Create New Account
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Login;
