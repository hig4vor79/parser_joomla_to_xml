import mysql from "mysql2/promise";
import fs from "fs";
import axios from "axios";

import "dotenv/config";

export const CONFIG = {
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  BASE_URL: process.env.BASE_URL,
  IMAGE_URL: process.env.IMAGE_URL,
  GOOGLE_TRANSLATE_API_KEY: process.env.GOOGLE_TRANSLATE_API_KEY,
  TRANSLATE_TO: process.env.TRANSLATE_TO,
};

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s*,\s*/g, "-") // Заменяем запятые и пробелы вокруг на "-"
    .replace(/\s+/g, "-") // Заменяем пробелы на "-"
    .replace(/[^a-z0-9а-яё-]/g, "") // Удаляем все кроме букв, цифр и "-"
    .replace(/-+/g, "-") // Убираем повторяющиеся "-"
    .replace(/^-|-$/g, ""); // Удаляем "-" в начале и конце
}

const parsProducts = async (connection) => {
  try {
    // SELECT
    // p.product_id AS id,
    // p.product_price AS price,
    // p.`product_old_price` AS old_price,
    // p.image,
    // p.`name_ru-RU` AS name,
    // p.`description_ru-RU` as description,
    // p.product_ean as articul,
    // p.`meta_title_ru-RU` as meta_title,
    // p.`meta_description_ru-RU` as meta_desc,
    // p.`meta_keyword_ru-RU` as meta_keywords,
    // p.`alias_ru-RU` as slug,
    // c.`name_ru-RU` as category_name,

    // ef.`name_ru-RU` as option_name_1,
    // efv.`name_ru-RU` as option_value_1,
    // ef2.`name_ru-RU` as option_name_2,
    // efv2.`name_ru-RU` as option_value_2,
    // ef3.`name_ru-RU` as option_name_3,
    // efv3.`name_ru-RU` as option_value_3,
    // ef4.`name_ru-RU` as option_name_4,
    // efv4.`name_ru-RU` as option_value_4,
    // ef5.`name_ru-RU` as option_name_5,
    // efv5.`name_ru-RU` as option_value_5,
    // ef6.`name_ru-RU` as option_name_6,
    // efv6.`name_ru-RU` as option_value_6,
    // ef7.`name_ru-RU` as option_name_7,
    // efv7.`name_ru-RU` as option_value_7,
    // ef8.`name_ru-RU` as option_name_8,
    // efv8.`name_ru-RU` as option_value_8,
    // ef9.`name_ru-RU` as option_name_9,
    // efv9.`name_ru-RU` as option_value_9,
    // ef10.`name_ru-RU` as option_name_10,
    // efv10.`name_ru-RU` as option_value_10,
    // ef11.`name_ru-RU` as option_name_11,
    // efv11.`name_ru-RU` as option_value_11,
    // ef12.`name_ru-RU` as option_name_12,
    // efv12.`name_ru-RU` as option_value_12,
    // ef13.`name_ru-RU` as option_name_13,
    // efv13.`name_ru-RU` as option_value_13,
    // ef14.`name_ru-RU` as option_name_14,
    // efv14.`name_ru-RU` as option_value_14,
    // ef15.`name_ru-RU` as option_name_15,
    // efv15.`name_ru-RU` as option_value_15,
    // ef16.`name_ru-RU` as option_name_16,
    // efv16.`name_ru-RU` as option_value_16,
    // ef17.`name_ru-RU` as option_name_17,
    // efv17.`name_ru-RU` as option_value_17,
    // ef18.`name_ru-RU` as option_name_18,
    // efv18.`name_ru-RU` as option_value_18,
    // ef19.`name_ru-RU` as option_name_19,
    // efv19.`name_ru-RU` as option_value_19,
    // ef20.`name_ru-RU` as option_name_20,
    // efv20.`name_ru-RU` as option_value_20,
    // ef21.`name_ru-RU` as option_name_21,
    // efv21.`name_ru-RU` as option_value_21,
    // ef22.`name_ru-RU` as option_name_22,
    // efv22.`name_ru-RU` as option_value_22

    // FROM bagtop_jshopping_products AS p
    // LEFT JOIN bagtop_jshopping_products_to_categories AS cp
    // ON cp.product_id = p.product_id
    // LEFT JOIN bagtop_jshopping_categories AS c
    // ON cp.category_id = c.category_id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef on 1 = ef.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv on p.extra_field_1 = efv.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef2 on 2 = ef2.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv2 on p.extra_field_2 = efv2.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef3 on 3 = ef3.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv3 on p.extra_field_3 = efv3.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef4 on 4 = ef4.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv4 on p.extra_field_4 = efv4.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef5 on 5 = ef5.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv5 on p.extra_field_5 = efv5.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef6 on 6 = ef6.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv6 on p.extra_field_6 = efv6.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef7 on 7 = ef7.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv7 on p.extra_field_7 = efv7.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef8 on 8 = ef8.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv8 on p.extra_field_8 = efv8.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef9 on 9 = ef9.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv9 on p.extra_field_9 = efv9.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef10 on 10 = ef10.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv10 on p.extra_field_10 = efv10.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef11 on 11 = ef11.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv11 on p.extra_field_11 = efv11.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef12 on 12 = ef12.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv12 on p.extra_field_12 = efv12.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef13 on 13 = ef13.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv13 on p.extra_field_13 = efv13.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef14 on 14 = ef14.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv14 on p.extra_field_14 = efv14.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef15 on 15 = ef15.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv15 on p.extra_field_15 = efv15.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef16 on 16 = ef16.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv16 on p.extra_field_16 = efv16.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef17 on 17 = ef17.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv17 on p.extra_field_17 = efv17.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef18 on 18 = ef18.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv18 on p.extra_field_18 = efv18.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef19 on 19 = ef19.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv19 on p.extra_field_19 = efv19.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef20 on 20 = ef20.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv20 on p.extra_field_20 = efv20.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef21 on 21 = ef21.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv21 on p.extra_field_21 = efv21.id
    // LEFT JOIN bagtop_jshopping_products_extra_fields as ef22 on 22 = ef22.id
    // LEFT JOIN bagtop_jshopping_products_extra_field_values as efv22 on p.extra_field_22 = efv22.id

    // WHERE product_ean = "Yuvel-BR058";

    // <entry>
    //   <g:id>6356</g:id>
    //   <g:price>338.000000</g:price>
    //   <g:image>Yuvel-BR058-Sh7mm-L18cm-338.JPG</g:image>
    //   <g:name>Браслет Xuping</g:name>
    //   <g:category_id>175</g:category_id>
    //   <product_attribute>
    //     <attribute>
    //       <group_ru>ОСНОВНЫЕ ХАРАКТЕРИСТИКИ</group_ru>
    //       <attribute_ru>Материал </attribute_ru>
    //       <value_ru>листовая сталь</value_ru>
    //       <group_uk>ОСНОВНЫЕ ХАРАКТЕРИСТИКИ</group_uk>
    //       <attribute_uk>Материал </attribute_uk>
    //       <value_uk>листовая сталь</value_uk>
    //     </attribute>
    //     <attribute>
    //       <group_ru>ОСНОВНЫЕ ХАРАКТЕРИСТИКИ</group_ru>
    //       <attribute_ru>Ширина, мм</attribute_ru>
    //       <value_ru>50</value_ru>
    //       <group_uk>ОСНОВНЫЕ ХАРАКТЕРИСТИКИ</group_uk>
    //       <attribute_uk>Ширина, мм</attribute_uk>
    //       <value_uk>50</value_uk>
    //     </attribute>
    //     <attribute>
    //       <group_ru>ОСНОВНЫЕ ХАРАКТЕРИСТИКИ</group_ru>
    //       <attribute_ru>Защита</attribute_ru>
    //       <value_ru>оцинковка по Сендзимиру</value_ru>
    //       <group_uk>ОСНОВНЫЕ ХАРАКТЕРИСТИКИ</group_uk>
    //       <attribute_uk>Защита</attribute_uk>
    //       <value_uk>оцинковка по Сендзимиру</value_uk>
    //     </attribute>
    //   </product_attribute>
    // </entry>;

    // SELECT
    // p.product_id AS id,
    // p.product_price AS price,
    // p.`product_old_price` AS old_price,
    // p.image,
    // p.`name_ru-RU` AS name,
    // p.`description_ru-RU` as description,
    // p.product_ean as articul,
    // p.`meta_title_ru-RU` as meta_title,
    // p.`meta_description_ru-RU` as meta_desc,
    // p.`meta_keyword_ru-RU` as meta_keywords,
    // p.`alias_ru-RU` as slug,
    // c.`name_ru-RU` as category_name
    // FROM bagtop_jshopping_products AS p
    // LEFT JOIN bagtop_jshopping_products_to_categories AS cp
    // ON cp.product_id = p.product_id
    // LEFT JOIN bagtop_jshopping_categories AS c
    // ON cp.category_id = c.category_id
    // WHERE cp.category_id = 174;

    console.log("Подключение к базе данных успешно установлено");

    //todo
    const [results] = await connection.query(
      `SELECT
        p.product_id AS id,
        p.product_price AS price,
        p.product_old_price AS old_price,
        p.image,
        p.\`name_ru-RU\` AS name,
        p.\`description_ru-RU\` AS description,
        p.product_ean AS articul,
        p.\`meta_title_ru-RU\` AS meta_title,
        p.\`meta_description_ru-RU\` AS meta_desc,
        p.\`meta_keyword_ru-RU\` AS meta_keywords,
        p.\`alias_ru-RU\` AS slug,
        c.\`name_ru-RU\` AS category_name,
        
        ${Array.from(
          { length: 22 },
          (_, i) => `
          ef${i + 1}.\`name_ru-RU\` AS array__option_${i + 1}_name,
          efv${i + 1}.\`name_ru-RU\` AS array__option_${i + 1}_value
        `
        ).join(",")}
      
      FROM bagtop_jshopping_products AS p
      LEFT JOIN bagtop_jshopping_products_to_categories AS cp ON cp.product_id = p.product_id
      LEFT JOIN bagtop_jshopping_categories AS c ON cp.category_id = c.category_id
      
      ${Array.from(
        { length: 22 },
        (_, i) => `
        LEFT JOIN bagtop_jshopping_products_extra_fields AS ef${i + 1} ON ${
          i + 1
        } = ef${i + 1}.id
        LEFT JOIN bagtop_jshopping_products_extra_field_values AS efv${
          i + 1
        } ON p.extra_field_${i + 1} = efv${i + 1}.id
      `
      ).join(" ")}
      
      WHERE p.product_ean = ?`,
      ["Yuvel-BR058"]
    );

    console.log("PARS IS SUCCESS");

    return results;
  } catch (err) {
    console.error("Ошибка при выполнении запроса:", err);
    return []; // Возвращаем пустой массив в случае ошибки
  }
};

const parsCategories = async (connection) => {
  try {
    const [results] = await connection.query(
      `SELECT 
        c.category_id AS id, 
        c.\`name_ru-RU\` AS name, 
        c.\`name_ru-RU\` AS name, 
        c.\`description_ru-RU\` AS description,
        pc.\`name_ru-RU\` AS parent_name, 
        c.category_image AS image, 
        c.\`alias_ru-RU\` AS slug, 
        c.\`meta_title_ru-RU\` AS meta_title, 
        c.\`meta_description_ru-RU\` AS meta_desc, 
        c.\`meta_keyword_ru-RU\` AS meta_keywords
      FROM bagtop_jshopping_categories AS c 
      LEFT JOIN bagtop_jshopping_categories AS pc ON c.category_parent_id = pc.category_id
      `
    );

    console.log("PARS CATEGORIES IS SUCCESS");

    await Promise.all(
      results.map(async (result) => {
        if (result.parent_name == null) result.parent_name = "";

        if (result.image) {
          result.image = CONFIG.IMAGE_URL + result.image;
        } else {
          result.image = "";
        }
        if (!result.meta_title) result.meta_title = result.name;
        if (!result.meta_desc) result.meta_desc = result.name;
        if (!result.meta_keywords) result.meta_keywords = result.name;

        // Ждем перевода, так как translateText() возвращает промис
        result.nameUK = await translateText(result.name, "uk");
        result.meta_titleUK = await translateText(result.meta_title, "uk");
        result.meta_keywordsUK = await translateText(
          result.meta_keywords,
          "uk"
        );
        result.meta_descUK = await translateText(result.meta_desc, "uk");
        result.slugUK = result.slug;
        result.slug = generateSlug(result.name);

        if (result.parent_name)
          result.parent_name = await translateText(result.parent_name, "uk");
      })
    );

    return results;
  } catch (err) {
    console.error("Ошибка при выполнении запроса:", err);
    return []; // Возвращаем пустой массив в случае ошибки
  }
};

const writeToXML = (results, fileName) => {
  // Создание XML структуры
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
  const xmlOpening = `<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">`;
  const xmlTitle = `<title>TEST</title>`;
  const xmlLink = `<link>https://test.com.ua</link>`;
  const xmlUpdated = `<updated>${new Date().toISOString()}</updated>`;
  const xmlEntries = results
    .map(
      (result) => `
      <entry>
        ${Object.entries(result)
          .map(([key, value]) => `<g:${key}>${value}</g:${key}>`)
          .join("\n")}
      </entry>`
    )
    .join("\n");

  const xmlContent = `${xmlHeader}
        ${xmlOpening}
        ${xmlTitle}
        ${xmlLink}
        ${xmlUpdated}
        ${xmlEntries}
      </feed>`;

  // Запись в файл feed.xml
  fs.writeFileSync(fileName, xmlContent);
  console.log("Файл feed.xml успешно создан.");
};

const writeProductsToXML = (results, fileName) => {
  // Создание XML структуры
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
  const xmlOpening = `<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">`;
  const xmlTitle = `<title>TEST</title>`;
  const xmlLink = `<link>https://test.com.ua</link>`;
  const xmlUpdated = `<updated>${new Date().toISOString()}</updated>`;

  const xmlEntries = results
    .map((result) => {
      const attributes = [];

      // Обработка атрибутов с префиксом array__
      for (let i = 1; i <= 22; i++) {
        const nameKey = `array__option_${i}_name`;
        const valueKey = `array__option_${i}_value`;

        if (result[nameKey]) {
          attributes.push({
            name: result[nameKey],
            value: result[valueKey] || "null", // Если значение пустое, то ставим 'null'
          });
        }
      }

      // Формируем строку для каждого атрибута
      const productAttributes = attributes
        .map(({ name, value }) => {
          return `<g:attribute>
              <g:group_ru>Характеристики</g:group_ru>
              <g:attribute_ru>${name}</g:attribute_ru>
              <g:value_ru>${value}</g:value_ru>
              <g:group_ua>Характеристики</g:group_ua>
          </g:attribute>`;
        })
        .join("\n");

      // Формирование XML-структуры для каждого результата
      return `<entry>
        <g:id>${result.id}</g:id>
        <g:price>${result.price}</g:price>
        <g:old_price>${result.old_price}</g:old_price>
        <g:image>${result.image}</g:image>
        <g:name>${result.name}</g:name>
        <g:description>${result.description}</g:description>
        <g:articul>${result.articul}</g:articul>
        <g:meta_title>${result.meta_title}</g:meta_title>
        <g:meta_desc>${result.meta_desc}</g:meta_desc>
        <g:meta_keywords>${result.meta_keywords}</g:meta_keywords>
        <g:slug>${result.slug}</g:slug>
        <g:category_name>${result.category_name}</g:category_name>

        <g:product_attribute>
          ${productAttributes}
        </g:product_attribute>
      </entry>`;
    })
    .join("\n");

  const xmlContent = `${xmlHeader}
        ${xmlOpening}
        ${xmlTitle}
        ${xmlLink}
        ${xmlUpdated}
        ${xmlEntries}
      </feed>`;

  // Запись в файл
  fs.writeFileSync(fileName, xmlContent);
  console.log("Файл feed.xml успешно создан.");
};

const translateText = async (text, targetLanguage = "ru") => {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${CONFIG.GOOGLE_TRANSLATE_API_KEY}`;

  try {
    const response = await axios.post(url, {
      q: text,
      target: targetLanguage,
    });

    const translatedText = response.data.data.translations[0].translatedText;

    return translatedText;
  } catch (error) {
    console.error("Error during translation:", error);
    throw error;
  }
};

const main = async () => {
  const connection = await mysql.createConnection({
    host: CONFIG.DB_HOST,
    user: CONFIG.DB_USER,
    password: CONFIG.DB_PASS,
    database: CONFIG.DB_NAME,
  });
  console.log("Подключение к базе данных успешно установлено");

  const parsResult = await parsProducts(connection);
  writeProductsToXML(parsResult, "products.xml");

  // const parsResultCat = await parsCategories(connection);
  // writeToXML(parsResultCat, "categories.xml");

  await connection.end();
  console.log("Соединение закрыто.");
};

main();

// async function main() {
//   // Настройки подключения
//   const connection = await mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "exampleDB",
//   });

//   let baseUrl = "https://example-joomla.com.ua/catalog";
//   let baseImageUrl =
//     "https://example-joomla.com.ua/components/com_jshopping/files/img_products";

//   try {
//     console.log("Подключение к базе данных успешно установлено");

//     // Запрос на получение категорий из таблицыs
//     const [categories] = await connection.query(
//       "SELECT category_id, `alias_nb-NO` FROM pariz.bagtop_jshopping_categories"
//     );

//     // Извлечение id и URL категорий
//     const filteredCategories = categories
//       .filter((row) => row["alias_nb-NO"].includes("xuping"))
//       .map((row) => ({
//         id: row.category_id,
//         alias: row["alias_nb-NO"], // Сохраняем alias вместе с id
//       }));

//     console.log("Массив категорий, содержащих 'xuping':", filteredCategories);

//     // Создаем массив для хранения всех товаров
//     let allProducts = [];

//     // Если есть отфильтрованные идентификаторы
//     if (filteredCategories.length > 0) {
//       // Проходим по каждой категории и получаем продукты
//       for (const { id, alias } of filteredCategories) {
//         console.log(`Категория: ${alias} (ID: ${id})`); // Выводим название категории

//         const [productsToCategories] = await connection.query(
//           `SELECT product_id FROM pariz.bagtop_jshopping_products_to_categories WHERE category_id = ?`,
//           [id]
//         );

//         const productIds = productsToCategories.map((row) => row.product_id);
//         console.log(
//           `ID подходящих продуктов для категории ${alias} (ID: ${id}):`,
//           productIds
//         );

//         if (productIds.length > 0) {
//           const [products] = await connection.query(
//             `SELECT * FROM pariz.bagtop_jshopping_products WHERE product_id IN (?)`,
//             [productIds]
//           );

//           const resultProducts = products.map((row) => ({
//             title: row["name_ru-RU"],
//             id: row.product_id,
//             price: row.product_price,
//             description: row["short_description_ru-RU"],
//             product_quantity: row.product_quantity,
//             availability:
//               row.product_publish == 0 ? "Out of stock" : "In stock",
//             image: baseImageUrl.concat("/", row.image),
//             link: baseUrl.concat("/", alias, "/", row["alias_ru-RU"]),
//           }));

//           allProducts.push(...resultProducts); // Сохраняем все продукты
//           console.log(
//             `Подходящие продукты для категории ${alias} (ID: ${id}):`,
//             resultProducts
//           );
//         } else {
//           console.log(
//             `Нет подходящих продуктов для категории ${alias} (ID: ${id}).`
//           );
//         }
//       }
//     } else {
//       console.log("Нет категорий, содержащих 'xuping'.");
//     }

//     // Создание XML структуры
//     const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
//     const feedOpening = `<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">`;
//     const feedTitle = `<title>Elsnab</title>`;
//     const feedLink = `<link>https://elsnab.com.ua</link>`;
//     const feedUpdated = `<updated>${new Date().toISOString()}</updated>`;
//     const feedEntries = allProducts
//       .map(
//         (product) => `
//       <entry>
//         <g:title>${product.title}</g:title>
//         <g:link>${product.link}</g:link>
//         <g:price>${product.price} UAH</g:price>
//         <g:id>${product.id}</g:id>
//         <g:availability>${product.availability.toLowerCase()}</g:availability>
//         <g:description><![CDATA[${product.description}]]></g:description>
//         <g:image_link>${product.image}</g:image_link>
//       </entry>
//     `
//       )
//       .join("");

//     const xmlContent = `${xmlHeader}
//     ${feedOpening}
//       ${feedTitle}
//       ${feedLink}
//       ${feedUpdated}
//       ${feedEntries}
//     </feed>`;

//     // Запись в файл feed.xml
//     fs.writeFileSync(path.join(__dirname, "feed.xml"), xmlContent);
//     console.log("Файл feed.xml успешно создан.");
//   } catch (err) {
//     console.error("Ошибка при выполнении запроса:", err);
//   } finally {
//     // Закрытие соединения после завершения всех запросов
//     await connection.end();
//     console.log("Соединение закрыто.");
//   }
// }

// // Запуск основной функции
// main();
