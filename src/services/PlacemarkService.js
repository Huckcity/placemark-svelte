import axios from "axios";
import { verify } from "jsonwebtoken-esm";
import { userStore } from "../stores/user-store";

export class PlacemarkService {
  baseUrl = "";

  constructor(baseUrl) {
    this.baseUrl = baseUrl;

    const credentials = localStorage.placemarkSvelte;
    if (credentials) {
      const savedUser = JSON.parse(credentials);
      userStore.set({
        id: savedUser.id,
        username: savedUser.username,
        token: savedUser.token,
      });
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + savedUser.token;
    }
  }

  async login(username, password) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/users/authenticate`,
        { username, password }
      );
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + response.data.token;
      if (response.data.success) {
        const decodedToken = verify(
          response.data.token,
          "definitelydontsharethis"
        );
        userStore.set({
          // @ts-ignore
          id: decodedToken.id,
          username,
          token: response.data.token,
        });
        localStorage.placemarkSvelte = JSON.stringify({
          // @ts-ignore
          id: decodedToken.id,
          username: username,
          token: response.data.token,
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async logout() {
    userStore.set({
      id: "",
      username: "",
      token: "",
    });
    axios.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem("placemarkSvelte");
  }

  async signup(username, email, password, passwordConfirm) {
    try {
      const userDetails = {
        username,
        email,
        password,
        passwordConfirm,
      };
      await axios.post(this.baseUrl + "/api/users/add", userDetails);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUserPlaces(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/places/user/" + id);
      return response.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getPublicPlaces() {
    try {
      const response = await axios.get(this.baseUrl + "/api/places");
      return response.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getPublicPlaceById(id) {
    try {
      const response = await axios.get(
        this.baseUrl + "/api/places/public/" + id
      );
      return response.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getPlaceById(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/places/" + id);
      return response.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async getCategories() {
    try {
      const response = await axios.get(this.baseUrl + "/api/categories");
      return response.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getReviewsByPlaceId(id) {
    try {
      const response = await axios.get(
        this.baseUrl + "/api/reviews/place/" + id
      );
      return response.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}
