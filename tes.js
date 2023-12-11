import { scrapeGoogleNews } from "./app/controller/googleNews.js";
import { GoogleNews, Perusahaan } from "./app/models/index.js";

const kode = await Perusahaan.findAll();

for(const link  of kode){
  await scrapeGoogleNews(link.KODE)
}