import lume from "lume/mod.ts";
import theme from "theme/mod.ts";
import markdownItBlockquote from "./plugins/markdownItBlockquote.ts";
import titleFromFilename from "./plugins/titleFromFilename.ts";

const site = lume({ dest: ".lume/_site" })
	.use(
		theme({
			shikiji: {
				highlighter: {
					themes: ["github-dark", "github-light"],
					langs: [
						"javascript",
						"yaml",
						"markdown",
						"bash",
						"json",
						"typescript",
						"ini",
					],
				},
				themes: {
					dark: "github-dark",
					light: "github-light",
				},
				cssFile: "/styles/shikiji.css",
				useColorScheme: true,
			},
		}),
	)
	.use(markdownItBlockquote())
	.use(titleFromFilename())
	.copy("favicons", ".")
	.copy("assets")
	.remoteFile(
		"favicon.png",
		import.meta.resolve("./theme/favicons/favicon.png"),
	);

const myFiles = [
	"_data/i18n.yml",
	"_data.yml",
	"assets/dark.svg",
	"assets/light.svg",
	"favicons/apple-touch-icon-60x60.png",
	"favicons/apple-touch-icon-76x76.png",
	"favicons/apple-touch-icon-114x114.png",
	"favicons/apple-touch-icon-120x120.png",
	"favicons/apple-touch-icon-144x144.png",
	"favicons/apple-touch-icon-180x180.png",
	"favicons/apple-touch-icon.png",
	"favicons/favicon-32.png",
	"favicons/favicon-64.png",
	"favicons/favicon-96.png",
	"favicons/favicon-196.png",
	"favicons/favicon.ico",
	"favicons/favicon.png",
];

for (const file of myFiles) {
	site.remoteFile(file, import.meta.resolve(`./theme/${file}`));
}

export default site;
