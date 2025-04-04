import CountryItem from "./CountryItem";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./CountriesList.module.css";
import { useCities } from "../contexts/CitiesContext";

function CountriesList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  // const countries = cities.reduce((acc, city) => {
  //   if (!acc.map((el) => el.country).includes(city.country))
  //     return [...acc, { country: city.country, emoji: city.emoji }];
  //   else return acc;
  // }, []);

  // const countries = [
  //   ...new Map(
  //     cities.map(({ country, emoji }) => [country, { country, emoji }]),
  //   ).values(),
  // ];

  const knownCountries = new Set();
  const countries = cities.flatMap(({ country, emoji }) => {
    if (!knownCountries.has(country)) {
      knownCountries.add(country);
      return { country, emoji };
    } else return [];
  });

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountriesList;
