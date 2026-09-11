export type RoomTile = {
  id: string;
  title: string;
  text?: string;
  priceLabel: string;
  priceValue?: string;
  tags: string[];
  image: string;
  alt: string;
  size: "lg" | "md" | "sm";
  speed: number;
};

export const hotelMeta = {
  name: "Vespera",
  phone: "+7 (495) 120-48-90",
  phoneHref: "tel:+74951204890",
  email: "stay@vespera.hotel",
  address: "Оливковый переулок, 12 · холмы у моря",
  checkIn: "15:00",
  checkOut: "11:00",
  hours: "Бронирование ежедневно 8:00–22:00",
};

export const rooms: RoomTile[] = [
  {
    id: "grand-suite",
    title: "Гранд-сьют",
    text: "Терраса, отдельно стоящая ванна и гостиная для поздних разговоров.",
    priceLabel: "от",
    priceValue: "68 000 ₽",
    tags: ["Сигнатур", "120 м²"],
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80",
    alt: "Гостиная гранд-сьюта с бархатной мебелью и тёплым светом",
    size: "lg",
    speed: 0.15,
  },
  {
    id: "executive",
    title: "Номер Executive",
    text: "Кровать king · тропический душ · вид на сад",
    priceLabel: "от",
    priceValue: "32 000 ₽",
    tags: ["Тихое крыло", "42 м²"],
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    alt: "Номер Executive с большой кроватью и мягким дневным светом",
    size: "md",
    speed: 0.08,
  },
  {
    id: "spa",
    title: "Кедровый спа",
    priceLabel: "процедуры от",
    priceValue: "9 500 ₽",
    tags: ["Wellness"],
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
    alt: "Спа-кабинет с полотенцами и свечами",
    size: "sm",
    speed: 0.12,
  },
  {
    id: "pool",
    title: "Инфинити-бассейн",
    priceLabel: "открыт с рассвета до полуночи",
    tags: ["Бассейн"],
    image:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80",
    alt: "Инфинити-бассейн на фоне вечернего неба",
    size: "sm",
    speed: 0.1,
  },
  {
    id: "dining",
    title: "Ресторан на крыше",
    priceLabel: "сезонное дегустационное меню",
    tags: ["Кухня"],
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
    alt: "Стол на крыше, накрытый к ужину",
    size: "sm",
    speed: 0.14,
  },
];

export const services = [
  {
    id: "transfer",
    title: "Трансфер",
    text: "Встречаем у трапа или у вокзала. Автомобиль с тихим салоном и водой.",
  },
  {
    id: "breakfast",
    title: "Завтрак до полудня",
    text: "Домашняя выпечка, сезонные фрукты и кофе так, как вы просите.",
  },
  {
    id: "turndown",
    title: "Вечерний turndown",
    text: "Записка от команды, приглушённый свет и тишина без лишних ритуалов.",
  },
  {
    id: "concierge",
    title: "Личный консьерж",
    text: "Столики, экскурсии, редкие вина — всё без спешки и лишних звонков.",
  },
];

export const diningHighlights = [
  {
    title: "Завтрак в саду",
    text: "Медленный старт дня среди олив и цитрусовых.",
  },
  {
    title: "Дегустация Atelier",
    text: "Шесть перемен блюд от шефа — только по брони.",
  },
  {
    title: "Винный погреб",
    text: "Подборка из долины и редкие европейские бутылки.",
  },
];

export const gallery = [
  {
    id: "lobby",
    src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    alt: "Вечерний вид на фасад бутик-отеля",
    caption: "Фасад · золотой час",
  },
  {
    id: "bath",
    src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    alt: "Мраморная ванная с мягким освещением",
    caption: "Ванная Гранд-сьюта",
  },
  {
    id: "lounge",
    src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    alt: "Гостиная отеля с камином и креслами",
    caption: "Каминный салон",
  },
  {
    id: "terrace",
    src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    alt: "Терраса отеля с видом на холмы",
    caption: "Терраса · вид на холмы",
  },
];

export const testimonials = [
  {
    id: "1",
    quote:
      "Редко бывает, что отель помнит, как вы пьёте кофе — и при этом не навязывает внимания. Хочется вернуться только за тишиной.",
    author: "Анна К.",
    meta: "Гранд-сьют · октябрь",
  },
  {
    id: "2",
    quote:
      "Ужин на крыше и бассейн на рассвете. Всё ощущается как частный дом, а не расписание экскурсий.",
    author: "Михаил и Елена",
    meta: "Executive · июнь",
  },
  {
    id: "3",
    quote:
      "Спа без лишнего шума, персонал без сценария. Для нас это и есть роскошь.",
    author: "Дарья С.",
    meta: "Кедровый спа · март",
  },
];

export const faqs = [
  {
    q: "Есть ли парковка?",
    a: "Да, закрытая парковка для гостей включена в проживание. Сообщите номер авто при бронировании.",
  },
  {
    q: "Можно ли заселиться раньше?",
    a: "Ранний заезд возможен с 12:00 при наличии свободного номера — уточните у консьержа за сутки.",
  },
  {
    q: "Подходит ли отель для детей?",
    a: "Мы бутик для спокойного отдыха: дети от 12 лет. Для семей с малышами подскажем соседние виллы.",
  },
  {
    q: "Есть ли спа-пакеты?",
    a: "Да — массаж, ритуалы с кедром и парная. Бронь процедур лучше за 24 часа.",
  },
];
