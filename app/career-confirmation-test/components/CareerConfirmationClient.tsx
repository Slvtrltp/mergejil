"use client";

import React, { useState } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Career {
  id: string;
  name: string;
  nameМн: string;
  emoji: string;
  description: string;
  accent: string;
  tags: string[];
  requiredTraits: string[];
}

interface TestQuestion {
  id: string;
  text: string;
  options: { id: string; text: string; score: number }[];
}

interface CareerTest {
  careerId: string;
  questions: TestQuestion[];
}

// ── Career Data ───────────────────────────────────────────────────────────────
const CAREERS: Career[] = [
  {
    id: "software_engineer",
    name: "Software Engineer",
    nameМн: "Програм хангамжийн инженер",
    emoji: "💻",
    description: "Систем боловсруулж, нарийн төвөгтэй асуудлыг шийдвэрлэдэг логик сэтгэлгээтэй мэргэжил",
    accent: "#6ee7b7",
    tags: ["Техник", "Аналитик", "Бие даасан"],
    requiredTraits: ["Логик сэтгэлгээ", "Нарийн анхаарал", "Асуудал шийдвэрлэх"],
  },
  {
    id: "product_manager",
    name: "Product Manager",
    nameМн: "Бүтээгдэхүүний менежер",
    emoji: "🎯",
    description: "Бүтээгдэхүүний стратегийг удирдаж, багийг зохион байгуулж, алсын харааг дамжуулдаг",
    accent: "#f5a623",
    tags: ["Удирдлага", "Харилцаа", "Стратеги"],
    requiredTraits: ["Удирдах чадвар", "Харилцааны ур чадвар", "Стратегийн сэтгэлгээ"],
  },
  {
    id: "ux_designer",
    name: "UX Designer",
    nameМн: "UX Дизайнер",
    emoji: "🎨",
    description: "Хэрэглэгч төвтэй дизайн хийж, эмпатитай судалгаа явуулдаг бүтээлч мэргэжил",
    accent: "#a78bfa",
    tags: ["Бүтээлч", "Эмпати", "Хэрэглэгч"],
    requiredTraits: ["Бүтээлч сэтгэлгээ", "Эмпати", "Нарийн анхаарал"],
  },
  {
    id: "data_scientist",
    name: "Data Scientist",
    nameМн: "Өгөгдлийн шинжээч",
    emoji: "📊",
    description: "Өгөгдөлтэй ажиллаж, загвар бүтээж, туршилтыг үнэлдэг аналитик мэргэжил",
    accent: "#fbbf24",
    tags: ["Аналитик", "Техник", "Судалгаа"],
    requiredTraits: ["Математик сэтгэлгээ", "Судалгааны чадвар", "Логик дүн шинжилгээ"],
  },
  {
    id: "teacher",
    name: "Teacher / Educator",
    nameМн: "Багш / Сурган хүмүүжүүлэгч",
    emoji: "📚",
    description: "Санааг тайлбарлаж, суралцагчдыг дэмжиж, хүмүүстэй холбоо тогтоодог",
    accent: "#34d399",
    tags: ["Хүмүүс", "Харилцаа", "Дэмжлэг"],
    requiredTraits: ["Тайлбарлах чадвар", "Тэвчээр", "Хүмүүстэй ажиллах"],
  },
  {
    id: "marketing_specialist",
    name: "Marketing Specialist",
    nameМн: "Маркетингийн мэргэжилтэн",
    emoji: "📣",
    description: "Кампанит ажил зохион байгуулж, үзэгчидтэй холбогдож, шинэ санаагаар цэцэглэдэг",
    accent: "#f87171",
    tags: ["Бүтээлч", "Харилцаа", "Уян хатан"],
    requiredTraits: ["Бүтээлч сэтгэлгээ", "Харилцааны ур чадвар", "Зах зээлийн мэдлэг"],
  },
  {
    id: "project_manager",
    name: "Project Manager",
    nameМн: "Төслийн менежер",
    emoji: "📋",
    description: "Даалгаврыг зохион байгуулж, хугацааг хянаж, нөөцийг зохицуулдаг",
    accent: "#60a5fa",
    tags: ["Зохион байгуулалт", "Шийдвэр", "Удирдлага"],
    requiredTraits: ["Зохион байгуулах чадвар", "Шийдвэр гаргах", "Багийн ажил"],
  },
  {
    id: "consultant",
    name: "Consultant",
    nameМн: "Зөвлөх",
    emoji: "🧩",
    description: "Бизнесийн олон төрлийн асуудлыг шийдэж, уян хатан, санаа баялаг ажлыг таашаадаг",
    accent: "#e879f9",
    tags: ["Асуудал шийдвэрлэх", "Уян хатан", "Харилцаа"],
    requiredTraits: ["Аналитик сэтгэлгээ", "Харилцааны ур чадвар", "Уян хатан байдал"],
  },
];

// ── Career-specific questions ─────────────────────────────────────────────────
const CAREER_TESTS: Record<string, TestQuestion[]> = {
  software_engineer: [
    {
      id: "se-1",
      text: "Та нарийн төвөгтэй алгоритм дибаг хийхэд хэдэн цаг зарцуулж чадах вэ?",
      options: [
        { id: "a", text: "Шийдэх хүртлээ — цаг хугацаа хамаагүй", score: 3 },
        { id: "b", text: "2-3 цаг, дараа нь тусламж хүсдэг", score: 2 },
        { id: "c", text: "1 цаг хүртэл, дараа нь уйддаг", score: 1 },
        { id: "d", text: "Ийм ажил надад таалагддаггүй", score: 0 },
      ],
    },
    {
      id: "se-2",
      text: "Шинэ программчлалын хэл сурах санал тавьвал та хэрхэн хандах вэ?",
      options: [
        { id: "a", text: "Маш их сонирхолтой — шууд эхэлнэ", score: 3 },
        { id: "b", text: "Хэрэгтэй бол сурна", score: 2 },
        { id: "c", text: "Хэцүү мэт санагдана, гэхдээ оролдоно", score: 1 },
        { id: "d", text: "Сонирхолгүй", score: 0 },
      ],
    },
    {
      id: "se-3",
      text: "Та ганцаараа ажиллах уу, эсвэл багаар ажиллах уу?",
      options: [
        { id: "a", text: "Ганцаараа гүнзгий анхаарлаа төвлөрүүлж ажиллах дуртай", score: 3 },
        { id: "b", text: "Хоёуланд нь тохиромжтой", score: 2 },
        { id: "c", text: "Багаар ажиллах дуртай", score: 1 },
        { id: "d", text: "Хамт олонгүйгээр ажиллаж чадахгүй", score: 0 },
      ],
    },
    {
      id: "se-4",
      text: "Кодын алдааг олоход та ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Сэтгэл хангалуун — тааварыг шийдсэн мэт", score: 3 },
        { id: "b", text: "Хэвийн — ажлын нэг хэсэг", score: 2 },
        { id: "c", text: "Бага зэрэг стресс авдаг", score: 1 },
        { id: "d", text: "Маш их стресс авдаг", score: 0 },
      ],
    },
    {
      id: "se-5",
      text: "Математик болон логикийн хичээлүүд танд хэрхэн байсан бэ?",
      options: [
        { id: "a", text: "Хамгийн дуртай хичээлүүд байсан", score: 3 },
        { id: "b", text: "Сайн байсан, таалагддаг байсан", score: 2 },
        { id: "c", text: "Дундаж байсан", score: 1 },
        { id: "d", text: "Хэцүү байсан, таалагддаггүй байсан", score: 0 },
      ],
    },
  ],
  product_manager: [
    {
      id: "pm-1",
      text: "Та баг удирдаж, зорилго тавьж өгөхдөө ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — энерги авдаг", score: 3 },
        { id: "b", text: "Сайн байдаг, хэрэгтэй бол хийнэ", score: 2 },
        { id: "c", text: "Бага зэрэг тав тухгүй байдаг", score: 1 },
        { id: "d", text: "Таалагддаггүй", score: 0 },
      ],
    },
    {
      id: "pm-2",
      text: "Олон талын эрх ашгийг зохицуулах нөхцөлд та хэрхэн ажилладаг вэ?",
      options: [
        { id: "a", text: "Маш сайн — дипломат байдлаар шийдвэрлэдэг", score: 3 },
        { id: "b", text: "Хэцүү боловч чадна", score: 2 },
        { id: "c", text: "Заримдаа хэцүү байдаг", score: 1 },
        { id: "d", text: "Маш хэцүү байдаг", score: 0 },
      ],
    },
    {
      id: "pm-3",
      text: "Бүтээгдэхүүний алсын харааг тодорхойлж, бусдад ойлгуулах чадвар танд байна уу?",
      options: [
        { id: "a", text: "Тийм, энэ миний хамгийн хүчтэй тал", score: 3 },
        { id: "b", text: "Боломжийн хэмжээнд байна", score: 2 },
        { id: "c", text: "Хөгжүүлэх шаардлагатай", score: 1 },
        { id: "d", text: "Энэ тал сул байдаг", score: 0 },
      ],
    },
    {
      id: "pm-4",
      text: "Өгөгдөл дүн шинжилгээ хийж, шийдвэр гаргах нь танд хэрхэн байдаг вэ?",
      options: [
        { id: "a", text: "Маш таалагддаг — өгөгдөлд тулгуурлан шийдвэр гардаг", score: 3 },
        { id: "b", text: "Хэрэгтэй бол хийдэг", score: 2 },
        { id: "c", text: "Бага зэрэг хэцүү байдаг", score: 1 },
        { id: "d", text: "Таалагддаггүй", score: 0 },
      ],
    },
    {
      id: "pm-5",
      text: "Та хурдан өөрчлөгдөж буй орчинд хэрхэн ажилладаг вэ?",
      options: [
        { id: "a", text: "Маш сайн — өөрчлөлт надад энерги өгдөг", score: 3 },
        { id: "b", text: "Дасан зохицдог", score: 2 },
        { id: "c", text: "Заримдаа хэцүү байдаг", score: 1 },
        { id: "d", text: "Тогтвортой орчинд илүү сайн ажилладаг", score: 0 },
      ],
    },
  ],
  ux_designer: [
    {
      id: "ux-1",
      text: "Та хэрэглэгчийн асуудлыг ойлгохын тулд ярилцлага хийхдээ ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — хүмүүсийн туршлагыг ойлгох дуртай", score: 3 },
        { id: "b", text: "Хэрэгтэй, хийдэг", score: 2 },
        { id: "c", text: "Бага зэрэг тав тухгүй байдаг", score: 1 },
        { id: "d", text: "Таалагддаггүй", score: 0 },
      ],
    },
    {
      id: "ux-2",
      text: "Дизайны шийдвэрийг өгөгдөл болон эмпатид тулгуурлан гаргах нь танд хэрхэн байдаг вэ?",
      options: [
        { id: "a", text: "Энэ бол миний хамгийн хүчтэй тал", score: 3 },
        { id: "b", text: "Боломжийн хэмжээнд чадна", score: 2 },
        { id: "c", text: "Хөгжүүлэх шаардлагатай", score: 1 },
        { id: "d", text: "Хэцүү байдаг", score: 0 },
      ],
    },
    {
      id: "ux-3",
      text: "Та бүтээлч ажил хийхдээ ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — бүтээлч байдал надад амьдрал өгдөг", score: 3 },
        { id: "b", text: "Таалагддаг", score: 2 },
        { id: "c", text: "Заримдаа таалагддаг", score: 1 },
        { id: "d", text: "Бүтээлч ажил надад хэцүү байдаг", score: 0 },
      ],
    },
    {
      id: "ux-4",
      text: "Шүүмжлэл хүлээн авч, дизайнаа дахин хийхэд та хэрхэн хандах вэ?",
      options: [
        { id: "a", text: "Сайн — шүүмжлэл бол өсөлтийн боломж", score: 3 },
        { id: "b", text: "Хэвийн хүлээн авдаг", score: 2 },
        { id: "c", text: "Бага зэрэг хэцүү байдаг", score: 1 },
        { id: "d", text: "Маш хэцүү байдаг", score: 0 },
      ],
    },
    {
      id: "ux-5",
      text: "Та нарийн ширийн зүйлд анхаарал хандуулдаг уу?",
      options: [
        { id: "a", text: "Тийм — нарийн ширийн зүйл надад маш чухал", score: 3 },
        { id: "b", text: "Ихэнхдээ анхаардаг", score: 2 },
        { id: "c", text: "Заримдаа", score: 1 },
        { id: "d", text: "Ерөнхий зургийг илүү харах дуртай", score: 0 },
      ],
    },
  ],
  data_scientist: [
    {
      id: "ds-1",
      text: "Том хэмжээний өгөгдлийн дотроос хэв маяг олох нь танд хэрхэн байдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — тааварыг шийдсэн мэт мэдрэмж", score: 3 },
        { id: "b", text: "Сонирхолтой байдаг", score: 2 },
        { id: "c", text: "Хэцүү боловч хийдэг", score: 1 },
        { id: "d", text: "Таалагддаггүй", score: 0 },
      ],
    },
    {
      id: "ds-2",
      text: "Математик, статистик хичээлүүд танд хэрхэн байсан бэ?",
      options: [
        { id: "a", text: "Хамгийн дуртай хичээлүүд байсан", score: 3 },
        { id: "b", text: "Сайн байсан", score: 2 },
        { id: "c", text: "Дундаж байсан", score: 1 },
        { id: "d", text: "Хэцүү байсан", score: 0 },
      ],
    },
    {
      id: "ds-3",
      text: "Та судалгааны ажил хийхдээ ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг", score: 3 },
        { id: "b", text: "Таалагддаг", score: 2 },
        { id: "c", text: "Хэрэгтэй бол хийдэг", score: 1 },
        { id: "d", text: "Таалагддаггүй", score: 0 },
      ],
    },
    {
      id: "ds-4",
      text: "Програмчлал болон кодчлолд та хэрхэн хандах вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг", score: 3 },
        { id: "b", text: "Хэрэгтэй бол хийдэг", score: 2 },
        { id: "c", text: "Суралцаж байна", score: 1 },
        { id: "d", text: "Хэцүү байдаг", score: 0 },
      ],
    },
    {
      id: "ds-5",
      text: "Таны дүн шинжилгээний үр дүнг бусдад ойлгомжтойгоор тайлбарлах чадвар хэрхэн байдаг вэ?",
      options: [
        { id: "a", text: "Маш сайн — нарийн зүйлийг энгийнээр тайлбарлаж чаддаг", score: 3 },
        { id: "b", text: "Боломжийн хэмжээнд", score: 2 },
        { id: "c", text: "Хөгжүүлэх шаардлагатай", score: 1 },
        { id: "d", text: "Хэцүү байдаг", score: 0 },
      ],
    },
  ],
  teacher: [
    {
      id: "te-1",
      text: "Та бусдад зүйл тайлбарлаж, ойлгуулахдаа ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — энерги авдаг", score: 3 },
        { id: "b", text: "Таалагддаг", score: 2 },
        { id: "c", text: "Хэрэгтэй бол хийдэг", score: 1 },
        { id: "d", text: "Тав тухгүй байдаг", score: 0 },
      ],
    },
    {
      id: "te-2",
      text: "Тэвчээртэй байх нь танд хэрхэн байдаг вэ?",
      options: [
        { id: "a", text: "Маш тэвчээртэй — энэ миний хамгийн хүчтэй тал", score: 3 },
        { id: "b", text: "Ихэнхдээ тэвчээртэй байдаг", score: 2 },
        { id: "c", text: "Заримдаа хэцүү байдаг", score: 1 },
        { id: "d", text: "Тэвчээр надад хэцүү байдаг", score: 0 },
      ],
    },
    {
      id: "te-3",
      text: "Хүүхэд болон залуучуудтай ажиллах нь танд хэрхэн байдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг", score: 3 },
        { id: "b", text: "Таалагддаг", score: 2 },
        { id: "c", text: "Хэрэгтэй бол хийдэг", score: 1 },
        { id: "d", text: "Хэцүү байдаг", score: 0 },
      ],
    },
    {
      id: "te-4",
      text: "Та хичээлийн материал бэлтгэж, хичээл заахдаа ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — бүтээлч байдлаар хийдэг", score: 3 },
        { id: "b", text: "Таалагддаг", score: 2 },
        { id: "c", text: "Хэрэгтэй бол хийдэг", score: 1 },
        { id: "d", text: "Таалагддаггүй", score: 0 },
      ],
    },
    {
      id: "te-5",
      text: "Суралцагчийн амжилтыг харахад та ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их сэтгэл хангалуун — энэ бол хамгийн том урамшуулал", score: 3 },
        { id: "b", text: "Сайхан мэдрэмж", score: 2 },
        { id: "c", text: "Хэвийн", score: 1 },
        { id: "d", text: "Онцгой мэдрэмж авдаггүй", score: 0 },
      ],
    },
  ],
  marketing_specialist: [
    {
      id: "mk-1",
      text: "Та бүтээлч кампанит ажил зохион байгуулахдаа ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — шинэ санаа байнга гардаг", score: 3 },
        { id: "b", text: "Таалагддаг", score: 2 },
        { id: "c", text: "Хэрэгтэй бол хийдэг", score: 1 },
        { id: "d", text: "Хэцүү байдаг", score: 0 },
      ],
    },
    {
      id: "mk-2",
      text: "Олон нийтийн мэдээллийн хэрэгслийг ашиглах нь танд хэрхэн байдаг вэ?",
      options: [
        { id: "a", text: "Маш сайн мэддэг, идэвхтэй ашигладаг", score: 3 },
        { id: "b", text: "Боломжийн хэмжээнд мэддэг", score: 2 },
        { id: "c", text: "Суралцаж байна", score: 1 },
        { id: "d", text: "Бага мэддэг", score: 0 },
      ],
    },
    {
      id: "mk-3",
      text: "Та өгөгдөл дүн шинжилгээ хийж, кампанийн үр дүнг хэмжихдээ ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг", score: 3 },
        { id: "b", text: "Хэрэгтэй, хийдэг", score: 2 },
        { id: "c", text: "Бага зэрэг хэцүү байдаг", score: 1 },
        { id: "d", text: "Таалагддаггүй", score: 0 },
      ],
    },
    {
      id: "mk-4",
      text: "Та хурдан өөрчлөгдөж буй зах зээлд хэрхэн дасан зохицдог вэ?",
      options: [
        { id: "a", text: "Маш сайн — өөрчлөлт надад урам зориг өгдөг", score: 3 },
        { id: "b", text: "Дасан зохицдог", score: 2 },
        { id: "c", text: "Заримдаа хэцүү байдаг", score: 1 },
        { id: "d", text: "Тогтвортой орчинд илүү сайн ажилладаг", score: 0 },
      ],
    },
    {
      id: "mk-5",
      text: "Та хүмүүстэй харилцаж, сүлжээ бүрдүүлэхдээ ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — энерги авдаг", score: 3 },
        { id: "b", text: "Таалагддаг", score: 2 },
        { id: "c", text: "Хэрэгтэй бол хийдэг", score: 1 },
        { id: "d", text: "Тав тухгүй байдаг", score: 0 },
      ],
    },
  ],
  project_manager: [
    {
      id: "pjm-1",
      text: "Та олон даалгаврыг нэгэн зэрэг зохион байгуулахдаа ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — зохион байгуулалт надад хялбар", score: 3 },
        { id: "b", text: "Боломжийн хэмжээнд чадна", score: 2 },
        { id: "c", text: "Заримдаа хэцүү байдаг", score: 1 },
        { id: "d", text: "Маш хэцүү байдаг", score: 0 },
      ],
    },
    {
      id: "pjm-2",
      text: "Хугацааны дарамтанд та хэрхэн ажилладаг вэ?",
      options: [
        { id: "a", text: "Маш сайн — дарамт надад анхаарлаа төвлөрүүлэхэд тусалдаг", score: 3 },
        { id: "b", text: "Боломжийн хэмжээнд", score: 2 },
        { id: "c", text: "Заримдаа хэцүү байдаг", score: 1 },
        { id: "d", text: "Дарамт надад сөргөөр нөлөөлдөг", score: 0 },
      ],
    },
    {
      id: "pjm-3",
      text: "Та баг доторх зөрчилдөөнийг шийдвэрлэхдээ ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш сайн — зуучлагч байх дуртай", score: 3 },
        { id: "b", text: "Хэрэгтэй бол хийдэг", score: 2 },
        { id: "c", text: "Бага зэрэг тав тухгүй байдаг", score: 1 },
        { id: "d", text: "Зөрчилдөөнөөс зайлсхийдэг", score: 0 },
      ],
    },
    {
      id: "pjm-4",
      text: "Та эрсдэлийг тооцоолж, урьдчилан сэргийлэхдээ ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — урьдчилан харах чадвар надад байдаг", score: 3 },
        { id: "b", text: "Боломжийн хэмжээнд", score: 2 },
        { id: "c", text: "Хөгжүүлэх шаардлагатай", score: 1 },
        { id: "d", text: "Хэцүү байдаг", score: 0 },
      ],
    },
    {
      id: "pjm-5",
      text: "Та тайлан, баримт бичиг бэлтгэхдээ ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Таалагддаг — нарийн бичиг баримт чухал гэж үздэг", score: 3 },
        { id: "b", text: "Хэрэгтэй, хийдэг", score: 2 },
        { id: "c", text: "Бага зэрэг уйтгартай байдаг", score: 1 },
        { id: "d", text: "Таалагддаггүй", score: 0 },
      ],
    },
  ],
  consultant: [
    {
      id: "co-1",
      text: "Та шинэ бизнесийн асуудлыг шийдвэрлэхдээ ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — шинэ сорилт надад урам зориг өгдөг", score: 3 },
        { id: "b", text: "Таалагддаг", score: 2 },
        { id: "c", text: "Хэрэгтэй бол хийдэг", score: 1 },
        { id: "d", text: "Тогтвортой ажил илүү таалагддаг", score: 0 },
      ],
    },
    {
      id: "co-2",
      text: "Та олон салбарын мэдлэгтэй байхыг хэрхэн хандах вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — олон зүйл сурах дуртай", score: 3 },
        { id: "b", text: "Таалагддаг", score: 2 },
        { id: "c", text: "Нэг чиглэлд гүнзгийрэх илүү дуртай", score: 1 },
        { id: "d", text: "Нэг мэргэжилд анхаарлаа төвлөрүүлэх дуртай", score: 0 },
      ],
    },
    {
      id: "co-3",
      text: "Та харилцагчтай харилцаж, итгэлцэл бүрдүүлэхдээ ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг", score: 3 },
        { id: "b", text: "Таалагддаг", score: 2 },
        { id: "c", text: "Хэрэгтэй бол хийдэг", score: 1 },
        { id: "d", text: "Тав тухгүй байдаг", score: 0 },
      ],
    },
    {
      id: "co-4",
      text: "Та богино хугацаанд шийдвэр гаргахдаа ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш сайн — хурдан шийдвэр гаргах чадвар надад байдаг", score: 3 },
        { id: "b", text: "Боломжийн хэмжээнд", score: 2 },
        { id: "c", text: "Заримдаа хэцүү байдаг", score: 1 },
        { id: "d", text: "Удаан бодох хэрэгтэй байдаг", score: 0 },
      ],
    },
    {
      id: "co-5",
      text: "Та өөрийн санааг итгэлтэйгээр танилцуулж, хамгаалахдаа ямар мэдрэмж авдаг вэ?",
      options: [
        { id: "a", text: "Маш их таалагддаг — итгэлтэй танилцуулга хийдэг", score: 3 },
        { id: "b", text: "Боломжийн хэмжээнд", score: 2 },
        { id: "c", text: "Хөгжүүлэх шаардлагатай", score: 1 },
        { id: "d", text: "Хэцүү байдаг", score: 0 },
      ],
    },
  ],
};

// ── Fallback questions for careers without specific tests ─────────────────────
const DEFAULT_QUESTIONS: TestQuestion[] = [
  {
    id: "def-1",
    text: "Энэ мэргэжлийн ажлын орчин танд хэрхэн тохирох вэ?",
    options: [
      { id: "a", text: "Маш их тохирно — яг миний хүссэн орчин", score: 3 },
      { id: "b", text: "Тохирно", score: 2 },
      { id: "c", text: "Дасан зохицож чадна", score: 1 },
      { id: "d", text: "Тохирохгүй", score: 0 },
    ],
  },
  {
    id: "def-2",
    text: "Энэ мэргэжлийн шаардлагатай ур чадварыг хөгжүүлэхэд та хэр бэлэн байна?",
    options: [
      { id: "a", text: "Маш бэлэн — аль хэдийн суралцаж эхэлсэн", score: 3 },
      { id: "b", text: "Бэлэн", score: 2 },
      { id: "c", text: "Суралцах хэрэгтэй", score: 1 },
      { id: "d", text: "Эхлэхэд хэцүү санагдана", score: 0 },
    ],
  },
  {
    id: "def-3",
    text: "Энэ мэргэжлийн өдөр тутмын ажлыг та хэрхэн харж байна?",
    options: [
      { id: "a", text: "Маш их сонирхолтой — өдөр бүр хийхэд бэлэн", score: 3 },
      { id: "b", text: "Сонирхолтой", score: 2 },
      { id: "c", text: "Зарим хэсэг нь сонирхолтой", score: 1 },
      { id: "d", text: "Тийм ч сонирхолтой биш", score: 0 },
    ],
  },
  {
    id: "def-4",
    text: "Энэ мэргэжлийн мэргэжилтнүүдтэй ярилцахад та ямар мэдрэмж авдаг вэ?",
    options: [
      { id: "a", text: "Маш их урам зориг авдаг", score: 3 },
      { id: "b", text: "Сонирхолтой байдаг", score: 2 },
      { id: "c", text: "Хэвийн", score: 1 },
      { id: "d", text: "Онцгой мэдрэмж авдаггүй", score: 0 },
    ],
  },
  {
    id: "def-5",
    text: "Та энэ мэргэжлийн ирээдүйн боломжийг хэрхэн харж байна?",
    options: [
      { id: "a", text: "Маш их боломжтой — урт хугацааны зорилго болгохыг хүсч байна", score: 3 },
      { id: "b", text: "Сайн боломжтой", score: 2 },
      { id: "c", text: "Дундаж боломжтой", score: 1 },
      { id: "d", text: "Тодорхойгүй байна", score: 0 },
    ],
  },
];

// ── Score interpretation ──────────────────────────────────────────────────────
function getScoreResult(score: number, maxScore: number) {
  const pct = (score / maxScore) * 100;
  if (pct >= 80)
    return {
      level: "Маш өндөр тохирол",
      color: "#6ee7b7",
      bg: "rgba(110,231,183,0.1)",
      border: "rgba(110,231,183,0.3)",
      message: "Энэ мэргэжил танд маш сайн тохирч байна! Таны хандлага, чадвар, сонирхол бүгд нийцэж байна.",
      icon: "🎯",
      confidence: "Итгэлтэй байж болно",
    };
  if (pct >= 60)
    return {
      level: "Сайн тохирол",
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.1)",
      border: "rgba(251,191,36,0.3)",
      message: "Энэ мэргэжил танд тохирч байна. Зарим талаараа хөгжүүлэх шаардлагатай боловч нийцэж байна.",
      icon: "✅",
      confidence: "Нэлээд итгэлтэй байж болно",
    };
  if (pct >= 40)
    return {
      level: "Дундаж тохирол",
      color: "#f5a623",
      bg: "rgba(245,166,35,0.1)",
      border: "rgba(245,166,35,0.3)",
      message: "Энэ мэргэжил танд хэсэгчлэн тохирч байна. Илүү гүнзгий судалж, туршлага хуримтлуулах хэрэгтэй.",
      icon: "⚡",
      confidence: "Нэмэлт судалгаа хийх хэрэгтэй",
    };
  return {
    level: "Бага тохирол",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.3)",
    message: "Энэ мэргэжил одоогоор танд тийм ч сайн тохирохгүй байна. Бусад мэргэжлийг судлах нь зүйтэй.",
    icon: "💡",
    confidence: "Бусад мэргэжлийг авч үзэх хэрэгтэй",
  };
}

// ── Main Component ─────────────────────────────────────────────────────────────
type Stage = "select" | "test" | "result";

export default function CareerConfirmationClient() {
  const [stage, setStage] = useState<Stage>("select");
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);

  const questions =
    selectedCareer
      ? CAREER_TESTS[selectedCareer.id] ?? DEFAULT_QUESTIONS
      : [];

  const handleSelectCareer = (career: Career) => {
    setSelectedCareer(career);
    setCurrentQ(0);
    setAnswers({});
    setSelectedOption(null);
    setTotalScore(0);
    setStage("test");
  };

  const handleAnswer = (optionId: string, score: number) => {
    setSelectedOption(optionId);
    setTimeout(() => {
      const newAnswers = { ...answers, [questions[currentQ].id]: score };
      setAnswers(newAnswers);
      setSelectedOption(null);
      if (currentQ + 1 < questions.length) {
        setCurrentQ((q) => q + 1);
      } else {
        const total = Object.values(newAnswers).reduce((a, b) => a + b, 0);
        setTotalScore(total);
        setStage("result");
      }
    }, 350);
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setAnswers({});
    setSelectedOption(null);
    setTotalScore(0);
    setStage("test");
  };

  const handleReset = () => {
    setStage("select");
    setSelectedCareer(null);
    setCurrentQ(0);
    setAnswers({});
    setSelectedOption(null);
    setTotalScore(0);
  };

  const maxScore = questions.length * 3;
  const result = selectedCareer ? getScoreResult(totalScore, maxScore) : null;
  const progress = questions.length > 0 ? ((currentQ) / questions.length) * 100 : 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#080c14", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── NAV ── */}
      <header
        style={{
          background: "rgba(8,12,20,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/home2" className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                style={{ background: "linear-gradient(135deg,#f5a623,#e8870a)", color: "#080c14" }}
              >
                М
              </div>
              <span className="font-bold text-sm tracking-tight" style={{ color: "#f1f5f9" }}>
                Мэргэжил<span style={{ color: "#f5a623" }}>.мн</span>
              </span>
            </Link>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>›</span>
            <span className="text-xs font-medium" style={{ color: "rgba(226,232,240,0.5)" }}>
              Мэргэжлийн баталгаажуулалт
            </span>
          </div>
          <Link
            href="/career-assessment"
            className="text-xs font-bold px-4 py-1.5 rounded-lg transition-all"
            style={{ background: "#f5a623", color: "#080c14" }}
          >
            Бүрэн үнэлгээ →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-screen-xl mx-auto px-5 lg:px-10 py-12 w-full">
        {/* ── STAGE: SELECT ── */}
        {stage === "select" && (
          <div>
            {/* Header */}
            <div className="mb-12 max-w-2xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                style={{
                  background: "rgba(245,166,35,0.1)",
                  border: "1px solid rgba(245,166,35,0.25)",
                  color: "#f5a623",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#f5a623", boxShadow: "0 0 6px #f5a623" }}
                />
                Мэргэжлийн баталгаажуулалтын тест
              </div>
              <h1
                className="font-black leading-tight mb-4"
                style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", letterSpacing: "-0.02em", color: "#f8fafc" }}
              >
                Сонирхсон мэргэжлээ{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg,#f5a623,#fbbf24)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  баталгаажуул
                </span>
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(226,232,240,0.55)" }}>
                Аль мэргэжлийг сонирхож байгаагаа сонгоод, тусгайлан боловсруулсан 5 асуултын тестийг өгнө үү.
                Тест нь тухайн мэргэжил танд үнэхээр тохирч байгаа эсэхийг тодорхойлно.
              </p>
            </div>

            {/* Career grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {CAREERS.map((career) => (
                <button
                  key={career.id}
                  onClick={() => handleSelectCareer(career)}
                  className="text-left rounded-2xl p-5 transition-all duration-200 group"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.borderColor = career.accent + "40";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{career.emoji}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                      style={{ color: career.accent }}
                    >
                      <path
                        d="M3 8H13M9 4L13 8L9 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="font-bold text-sm mb-1" style={{ color: "#f1f5f9" }}>
                    {career.nameМн}
                  </div>
                  <div className="text-xs mb-3 leading-relaxed" style={{ color: "rgba(226,232,240,0.45)" }}>
                    {career.description}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {career.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: career.accent + "15", color: career.accent }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom note */}
            <div
              className="mt-10 p-5 rounded-2xl flex items-start gap-4"
              style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)" }}
            >
              <span className="text-2xl flex-shrink-0">💡</span>
              <div>
                <div className="text-sm font-semibold mb-1" style={{ color: "#fbbf24" }}>
                  Бүрэн үнэлгээ авахыг хүсч байна уу?
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(226,232,240,0.5)" }}>
                  Энэхүү тест нь зөвхөн нэг мэргэжлийн тохирлыг шалгана. MBTI, IQ болон ур чадварын бүрэн үнэлгээгээр
                  таны хамгийн тохиромжтой мэргэжлийг олоорой.{" "}
                  <Link href="/career-assessment" style={{ color: "#f5a623" }} className="underline">
                    Бүрэн үнэлгээ эхлэх →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── STAGE: TEST ── */}
        {stage === "test" && selectedCareer && (
          <div className="max-w-2xl mx-auto">
            {/* Back */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-xs mb-8 transition-colors"
              style={{ color: "rgba(226,232,240,0.4)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#f1f5f9")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(226,232,240,0.4)")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10 7H4M6 4L2 7L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Мэргэжил дахин сонгох
            </button>

            {/* Career badge */}
            <div
              className="flex items-center gap-3 p-4 rounded-2xl mb-8"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-3xl">{selectedCareer.emoji}</span>
              <div>
                <div className="text-xs font-medium mb-0.5" style={{ color: "rgba(226,232,240,0.45)" }}>
                  Сонгосон мэргэжил
                </div>
                <div className="font-bold text-sm" style={{ color: "#f1f5f9" }}>
                  {selectedCareer.nameМн}
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xs font-medium" style={{ color: "rgba(226,232,240,0.45)" }}>
                  Асуулт
                </div>
                <div className="font-black text-lg" style={{ color: selectedCareer.accent }}>
                  {currentQ + 1}/{questions.length}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="h-1.5 rounded-full mb-8 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${selectedCareer.accent}, ${selectedCareer.accent}cc)`,
                }}
              />
            </div>

            {/* Question */}
            <div
              className="p-7 rounded-2xl mb-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-xs font-semibold mb-4" style={{ color: selectedCareer.accent }}>
                Асуулт {currentQ + 1}
              </div>
              <h2 className="font-bold text-lg leading-snug" style={{ color: "#f8fafc", letterSpacing: "-0.01em" }}>
                {questions[currentQ]?.text}
              </h2>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {questions[currentQ]?.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(opt.id, opt.score)}
                    disabled={selectedOption !== null}
                    className="text-left px-5 py-4 rounded-xl transition-all duration-200 font-medium text-sm"
                    style={{
                      background: isSelected
                        ? selectedCareer.accent + "18" :"rgba(255,255,255,0.03)",
                      border: isSelected
                        ? `1px solid ${selectedCareer.accent}60`
                        : "1px solid rgba(255,255,255,0.07)",
                      color: isSelected ? selectedCareer.accent : "rgba(226,232,240,0.75)",
                      transform: isSelected ? "scale(1.01)" : "scale(1)",
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedOption) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                        (e.currentTarget as HTMLElement).style.borderColor = selectedCareer.accent + "40";
                        (e.currentTarget as HTMLElement).style.color = "#f1f5f9";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedOption && !isSelected) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                        (e.currentTarget as HTMLElement).style.color = "rgba(226,232,240,0.75)";
                      }
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-black mr-3"
                      style={{
                        background: isSelected ? selectedCareer.accent : "rgba(255,255,255,0.08)",
                        color: isSelected ? "#080c14" : "rgba(226,232,240,0.5)",
                      }}
                    >
                      {opt.id.toUpperCase()}
                    </span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STAGE: RESULT ── */}
        {stage === "result" && selectedCareer && result && (
          <div className="max-w-2xl mx-auto">
            {/* Score card */}
            <div
              className="p-8 rounded-3xl mb-6 text-center"
              style={{ background: result.bg, border: `1px solid ${result.border}` }}
            >
              <div className="text-5xl mb-4">{result.icon}</div>
              <div className="text-3xl font-black mb-2" style={{ color: result.color }}>
                {Math.round((totalScore / maxScore) * 100)}%
              </div>
              <div className="font-bold text-lg mb-2" style={{ color: "#f8fafc" }}>
                {result.level}
              </div>
              <div className="text-sm leading-relaxed mb-4" style={{ color: "rgba(226,232,240,0.65)" }}>
                {result.message}
              </div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ background: result.color + "20", color: result.color, border: `1px solid ${result.color}40` }}
              >
                🔒 {result.confidence}
              </div>
            </div>

            {/* Career summary */}
            <div
              className="p-6 rounded-2xl mb-6 flex items-center gap-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-4xl">{selectedCareer.emoji}</span>
              <div className="flex-1">
                <div className="text-xs mb-1" style={{ color: "rgba(226,232,240,0.4)" }}>
                  Шалгасан мэргэжил
                </div>
                <div className="font-bold" style={{ color: "#f1f5f9" }}>
                  {selectedCareer.nameМн}
                </div>
                <div className="text-xs mt-1" style={{ color: "rgba(226,232,240,0.45)" }}>
                  {selectedCareer.description}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs mb-1" style={{ color: "rgba(226,232,240,0.4)" }}>
                  Оноо
                </div>
                <div className="font-black text-xl" style={{ color: selectedCareer.accent }}>
                  {totalScore}/{maxScore}
                </div>
              </div>
            </div>

            {/* Score breakdown */}
            <div
              className="p-6 rounded-2xl mb-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-xs font-semibold mb-4" style={{ color: "rgba(226,232,240,0.5)" }}>
                ШААРДЛАГАТАЙ ЧАДВАРУУД
              </div>
              <div className="flex flex-col gap-3">
                {selectedCareer.requiredTraits.map((trait, i) => {
                  const qScore = Object.values(answers)[i] ?? 0;
                  const pct = (qScore / 3) * 100;
                  return (
                    <div key={trait}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span style={{ color: "rgba(226,232,240,0.7)" }}>{trait}</span>
                        <span style={{ color: selectedCareer.accent }}>{Math.round(pct)}%</span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: selectedCareer.accent,
                            transition: "width 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(226,232,240,0.7)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")}
              >
                🔄 Дахин тест өгөх
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(226,232,240,0.7)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")}
              >
                🔍 Өөр мэргэжил шалгах
              </button>
              <Link
                href="/career-assessment"
                className="flex-1 py-3.5 rounded-xl font-bold text-sm text-center transition-all"
                style={{ background: "#f5a623", color: "#080c14", boxShadow: "0 0 20px rgba(245,166,35,0.25)" }}
              >
                Бүрэн үнэлгээ авах →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
