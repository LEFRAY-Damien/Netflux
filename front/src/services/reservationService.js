import api from "@/api/axios";

export default {
  getReservations() {
    return api.get("/reservations");
  },

  getReservation(id) {
    return api.get(`/reservations/${id}`);
  },

  createReservation(data) {
    return api.post("/reservations", data);
  },

  updateReservation(id, data) {
    return api.put(`/reservations/${id}`, data);
  },

  deleteReservation(id) {
    return api.delete(`/reservations/${id}`);
  }
};
