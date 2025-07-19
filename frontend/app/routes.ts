    import { type RouteConfig, index, route } from "@react-router/dev/routes";

    export default [
        index("routes/home.tsx"),
        route('dashboard', 'routes/dashboard.tsx'),
        route('main', 'routes/main.tsx'),
        route('flight-details/:id', 'routes/flight_details.tsx'),
        route('insured-flights', 'routes/insured_flights.tsx'),
        route('insure-flight', 'routes/insure_flight.tsx'),
        route('wallet', 'routes/wallet.tsx'),
        route('claims', 'routes/claims.tsx'),
        route('lucky-spin', 'routes/lucky_spin.tsx'),
        route('battle-ship', 'routes/battle_ship.tsx')
    ] satisfies RouteConfig;
