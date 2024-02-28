import React from "react";
import {
  Button,
  Dropdown,
  Input,
  Layout,
  Menu,
  MenuProps,
  Modal,
  Typography,
} from "antd";
import { useRouter } from "next/router";

const { Header, Content, Footer, Sider } = Layout;

const TopLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return <Layout>hello</Layout>;
};

export default TopLayout;
