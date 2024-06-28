import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { Button, Checkbox, Col, Form, FormProps, Input } from "antd";
import { ENV } from "@/src/env/env";
import { setCookie } from "nookies";
import LoadingOverlay from "@/src/components/spin/loadingOverlay";
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (
    values: FieldType
  ) => {
    const response = await fetch(`${ENV.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data.access_token);
      setLoading(true);
      // Simulate API call or async operation
      setTimeout(() => {
        console.log("Login successful");
        router.push("/"); // Redirect to dashboard after login
        setLoading(false);
      }, 2000); // Simulated loading time
      // Set the cookie with the access token
      setCookie(null, "token", data.access_token, {
        maxAge: 30 * 24 * 60 * 60, // Set the expiration time (e.g., 30 days)
        path: "/",
      });
    } else {
      console.error("Login failed");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Col
        span={24}
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <LoadingOverlay loading={loading} />
    </div>
  );
}
