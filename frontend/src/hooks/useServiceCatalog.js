import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient";
let shared = null;
function load() {
  if (!shared)
    shared = apiRequest("/api/v1/catalog")
      .then((rows) =>
        Array.isArray(rows)
          ? rows.filter(
              (x) =>
                typeof x.name === "string" &&
                typeof x.icon === "string" &&
                typeof x.background === "string",
            )
          : [],
      )
      .finally(() => {
        shared = null;
      });
  return shared;
}
export function useServiceCatalog() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let active = true;
    load()
      .then((rows) => {
        if (active) setItems(rows);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  return items;
}
