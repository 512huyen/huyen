import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.formTypes + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, name, value, active, selected, sort) {
    let url = constants.api.formTypes + "?";
    url += "page=" + (page || 0) + "&";
    url += "size=" + (size || 10);
    if (name) url += "&name=" + name;
    if (value) url += "&value=" + value;
    // if (sort) url += "sort=" + sort;
    if (active !== undefined && active !== -1)
      url += "&active=" + (active ? 1 : 0);
    if (selected !== undefined) url += "&selected=" + (selected ? 1 : 0);
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.formTypes + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, name, active, value, description) {
    if (!id) {
      let url = constants.api.formTypes;
      return client.requestApi("post", url, {
        name,
        value,
        description,
        active: active ? 1 : 0
      });
    } else {
      let url = constants.api.formTypes + "/" + id;
      return client.requestApi("put", url, {
        name,
        value,
        description,
        active: active ? 1 : 0
      });
    }
  },
  setMyJob(jobs) {
    let url = constants.api.job.set_my_job;
    return client.requestApi("put", url, {
      jobs
    });
  }
};
