const path = require("path");

module.exports = {
	mode: 'development',
	devtool: "source-map",
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"]
	},
	entry: {
		index: './src/index.tsx',		
		exam: './src/exam/index.tsx',		
		manage: './src/manage/index.tsx',		
	},
	output: {
		path: path.resolve(__dirname, "wwwroot/js"),
		filename: "[name].bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader"
					}
				]
			},
			{
				test: /\.js(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: { presets: ['@babel/preset-react'] }
					}
				]
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
		]
	},
	//externals: {
	//	"react": "React",
	//	"react-dom": "ReactDOM",
	//	"react-router-dom": "ReactRouterDOM"
	//}
};