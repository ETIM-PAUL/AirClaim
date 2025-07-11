    import { type RouteConfig, index, route } from "@react-router/dev/routes";

    export default [
        index("routes/home.tsx"),
        route('dashboard', 'routes/dashboard.tsx'),
        route('main', 'routes/main.tsx'),
        route('Tashboard', 'routes/Tashboard.tsx'),
    ] satisfies RouteConfig;
