import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
function NavbarComponent() {
  const navigate = useNavigate();
  // const auth = useAuth();

  // const handleLogout = () => {
  //   auth.logout();
  //   navigate("/login"); // Chuyển hướng người dùng về trang đăng nhập
  // };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#">Management</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/orders">Đơn Hàng</Nav.Link>
        <Nav.Link href="/add-order">Thêm Đơn Hàng</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default NavbarComponent;
