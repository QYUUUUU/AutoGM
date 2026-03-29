import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: './app/public/js/dashboardDies.js', // Your main JS file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'app/public/js'), // Output directory
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    resolve: {
        alias: {
            three: path.resolve(__dirname, 'node_modules/three/build/three.module.js'),
            cannon: path.resolve(__dirname, 'node_modules/cannon/build/cannon.js'),
            OrbitControls: path.resolve(__dirname, 'node_modules/three/examples/jsm/controls/OrbitControls.js'),
            stats: path.resolve(__dirname, 'node_modules/three/examples/jsm/libs/stats.module.js'),
            dice: path.resolve(__dirname, 'node_modules/threejs-dice/lib/dice.js'),
        },
    },
};