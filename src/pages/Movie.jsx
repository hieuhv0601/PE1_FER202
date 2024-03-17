import React from "react";
import Header from "../components/common/Header";
import NavbarComponent from "../components/common/NavbarComponent";
import SideBar from "../components/common/SideBar";
import { Form, Row, Col, Table, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { ModalsContext } from "../context/ModalsContext";
import { useForm } from "../hooks";
import { instance } from "../ultils";
const Movie = () => {
  const [producers, setProducers] = useState(null);
  const [movies, setMovies] = useState(null);
  const [filteredMovies, setFilterdMovies] = useState(null);
  const [filteredMoviesByName, setFilterdMoviesByName] = useState(null);
  const [directors, setDirectors] = useState(null);
  const [movieStars, setMovieStars] = useState(null);
  const [stars, setStars] = useState(null);
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const { showModals, hideModals } = useContext(ModalsContext);

  const EditForm = ({ initialValues, onSubmit }) => {
    // Initialize form state using useForm hook
    const { values, setFieldValue } = useForm(initialValues);

    // Define handleSubmit function to handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(values); // Pass form values to onSubmit function
    };

    return (
      <Form onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col} className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={values.Title}
              onChange={(e) => setFieldValue("Title", e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} className="mb-3">
            <Form.Label>Release Date</Form.Label>
            <Form.Control
              type="date"
              value={values.ReleaseDate}
              onChange={(e) => setFieldValue("ReleaseDate", e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={values.Description}
              onChange={(e) => setFieldValue("Description", e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} className="mb-3">
            <Form.Label>Language</Form.Label>
            <Form.Control
              type="text"
              value={values.Language}
              onChange={(e) => setFieldValue("Language", e.target.value)}
            />
          </Form.Group>
        </Row>
        <div className="d-flex justify-content-end gap-2">
          <Button type="submit" className="btn btn-primary">
            Save
          </Button>
          {/* You can add onCancel function to handle cancellation */}
        </div>
      </Form>
    );
  };

  const handleEditClick = (movie) => {
    showModals({
      title: "Edit Movie",
      children: <EditForm initialValues={movie} onSubmit={handleEditSubmit} />,
      footer: "",
    });
  };
  const handleEditSubmit = async (movie) => {
    console.log("movie", movie.Title);
    try {
      await instance.put(`/movies/${movie.id}`, movie);
      handleFetch();
      hideModals();
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteClick = async (movie) => {
    try {
      await instance.delete(`/movies/${movie.id}`);

      setFilterdMoviesByName(
        filteredMoviesByName.filter((m) => m.id !== movie.id)
      );
      hideModals();
    } catch (error) {
      console.error(error);
      // Handle errors appropriately (e.g., display error message)
    }
  };

  const filterMoviesByProducer = (id, movies) => {
    if (!id) {
      id = producers[0]?.id;
    }
    setFilterdMovies(movies?.filter((m) => m.ProducerId === id));
  };

  const filterMoviesByName = (value, filteredMovies) => {
    if (value.trim() === "") {
      setFilterdMoviesByName(filteredMovies);
    }
    setFilterdMoviesByName(
      filteredMovies?.filter((m) => m.Title.includes(value))
    );
  };

  useEffect(() => {
    if (movies) {
      filterMoviesByProducer(parseInt(params.get("producer")), movies);
    }
  }, [params, movies]);

  const handleFetch = async () => {
    try {
      const res1 = await instance.get("/producers");
      setProducers(res1.data);
      const res2 = await instance.get("/movies");
      setMovies(res2.data);
      filterMoviesByProducer(res1.data[0].id, res2.data);
      const res3 = await instance.get("/directors");
      setDirectors(res3.data);
      const res4 = await instance.get("/movie_star");
      setMovieStars(res4.data);
      const res5 = await instance.get("/stars");
      setStars(res5.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (filteredMovies) {
      filterMoviesByName(search, filteredMovies);
    }
  }, [filteredMovies, search]);

  const getDirectorName = (id) => {
    return directors?.find((d) => d.id === id)?.FullName;
  };

  const getStarsNameByMovieId = (id) => {
    const starIds = movieStars
      ?.filter((m) => m.MovieId === id)
      ?.map((movie) => movie.StarId);
    return stars
      ?.filter((s) => starIds.includes(s.id))
      ?.map((star) => star.FullName)
      .join(", ");
  };

  useEffect(() => {
    handleFetch();
  }, []);
  return (
    <>
      <NavbarComponent></NavbarComponent>
      <Header>
        <h2 className="text-center">Movie Management</h2>
        <div className="d-flex align-items-center justify-content-center mb-4">
          <Form.Control
            placeholder="Search..."
            className="w-25"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Row className="p-4 ">
          <SideBar producers={producers} />
          <Col sm={10}>
            <Table striped bordered responsive hover>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th>ReleaseDate</th>
                  <th>Description</th>
                  <th>Language</th>
                  <th>Directors</th>
                  <th>Stars</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {!filteredMoviesByName ? (
                  <tr>
                    <td colSpan={7}>...Loading</td>
                  </tr>
                ) : (
                  filteredMoviesByName.map((m) => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{m.Title}</td>
                      <td>{m.ReleaseDate}</td>
                      <td>{m.Description}</td>
                      <td>{m.Language}</td>
                      <td>{getDirectorName(m.DirectorId)}</td>
                      <td>{getStarsNameByMovieId(m.id)}</td>
                      <td>
                        <div>
                          <Button
                            onClick={() => handleEditClick(m)}
                            variant="primary"
                            className="mb-2"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(m)}
                            variant="danger"
                            className="mb-2"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Header>
    </>
  );
};

export default Movie;
