import { useSearchParams } from "react-router-dom";

function useQueryParams() {
  const [searchParams] = useSearchParams();
  const queryParam = Object.fromEntries(searchParams);
  return queryParam;
}

export default useQueryParams;
