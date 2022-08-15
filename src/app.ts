import { Express } from './utilities/PackageWrapper';
import ApplicationRoutes from './routes/index';
import Constants from './utilities/Constants';
import { InstantiateMongoDB } from './models/Index';
import Logger from './utilities/Logging';

const { PORT, APP_NAME, APP_DB_URI } = process.env;

const app = Express();

/** Setup the application JSON middlewares */
app.use(
    Express.json({
        limit: Constants.RequestMaxByteSize,
    })
);
app.use(
    Express.urlencoded({
        extended: true,
        limit: Constants.RequestMaxByteSize,
        parameterLimit: 200,
    })
);

/** Setup the application credentials  */

/** Setup observability in the application  */
app.use(Logger.logRequest()); // This initializes winston to log all request to the application

/** Setup database connection, models and controllers  */
new InstantiateMongoDB(APP_DB_URI as string);

/** Setup application routing */
app.use('/', ApplicationRoutes);

/** Run application server */
const APP_PORT: number = parseInt(<string>PORT, 10);
app.listen(APP_PORT, () => {
    console.log(`${APP_NAME as string} is running on port ${APP_PORT}.`);
});
