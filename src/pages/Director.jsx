import React from "react";
import Header from "../components/common/Header";
import { Container } from "react-bootstrap";
import NavbarComponent from "../components/common/NavbarComponent";

export default function Director() {
  return (
    <>
      <NavbarComponent></NavbarComponent>
      <Header>
        <div>Director</div>
      </Header>
    </>
  );
}
