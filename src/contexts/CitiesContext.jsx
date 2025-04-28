import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import supabase from "../services/supabase";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => action.payload !== city.id),
        currentCity: {},
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown action type");
  }
}

function flagemojiToPNG(flag) {
  if (!/^[a-zA-Z]+$/.test(flag)) {
    flag = Array.from(flag, (codeUnit) =>
      String.fromCharCode(codeUnit.codePointAt() - 127397).toLowerCase()
    ).join("");
  } else {
    flag = flag.toLowerCase();
  }
  return <img src={`https://flagcdn.com/24x18/${flag}.png`} alt="flag" />;
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });

      let { data: cities, error } = await supabase.from("cities").select("*");

      dispatch({ type: "cities/loaded", payload: cities });
      if (error) {
        dispatch({
          type: "rejected",
          payload: `There was an error loading cities: ${error}`,
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });

      let { data: city, error } = await supabase
        .from("cities")
        .select("*")
        .eq("id", id);

      dispatch({ type: "city/loaded", payload: city[0] });
      if (error) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the city: " + error,
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    let { data, error } = await supabase
      .from("cities")
      .insert(newCity)
      .select("*");

    dispatch({ type: "city/created", payload: data[0] });
    if (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    let { error } = await supabase.from("cities").delete().eq("id", id);

    dispatch({ type: "city/deleted", payload: id });
    if (error) {
      alert("There was an error deleting the city...");
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        flagemojiToPNG,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const value = useContext(CitiesContext);
  if (value === undefined)
    throw new Error("Cannot access context outside of CitiesProvider");
  return value;
}

export { CitiesProvider, useCities };
