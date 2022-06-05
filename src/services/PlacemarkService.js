import axios from "axios";
import * as fs from "fs";
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
          import.meta.env.VITE_JWT_SECRET
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

  async githubLogin() {
    try {
      const response = await axios.post(
        `https://cors-anyhuck.herokuapp.com/https://github.com/login/oauth/access_token?client_id=${
          import.meta.env.VITE_GITHUB_CLIENT_ID
        }&client_secret=${import.meta.env.VITE_GITHUB_CLIENT_SECRET}&code=${
          import.meta.env.VITE_GITHUB_CODE
        }&redirect_uri=${import.meta.env.VITE_GITHUB_REDIRECT_URI}`
      );

      console.log(response.data);
      const access_token = response.data.access_token;
      console.log(access_token);
    } catch (error) {
      console.log(error);
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

  async deleteImage(placeId, imageName) {
    try {
      const res = await axios.post(
        this.baseUrl + "/api/places/image/" + placeId + "/" + imageName
      );
      return res;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async addImage(formData) {
    try {
      const res = await axios.post(
        this.baseUrl + "/api/places/image/add",
        formData
      );
      return res;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
