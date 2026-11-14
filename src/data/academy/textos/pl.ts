import type { TextosAcademy } from '@/data/academy/estrutura';

/** Trust Academy po polsku. */
export const academyPl: TextosAcademy = {
  categorias: {
    basico: { nome: 'Pierwsze kroki', descricao: 'Podstawy porządkowania pieniędzy.' },
    orcamento: { nome: 'Budżet', descricao: 'Planowanie miesiąca i kontrola wydatków.' },
    dividas: { nome: 'Długi', descricao: 'Wyjść na plus i tam zostać.' },
    investimentos: { nome: 'Inwestowanie', descricao: 'Niech pieniądze pracują.' },
  },
  cursos: {
    'financas-do-zero': { titulo: 'Finanse od zera', resumo: 'Zrozum swoje wydatki, zbuduj fundusz awaryjny i wyznacz cele, które działają.' },
    'orcamento-sem-sofrimento': { titulo: 'Budżet bez cierpienia', resumo: 'Podziel dochód, kontroluj stałe opłaty i wydawaj bez wyrzutów sumienia.' },
    'saindo-do-vermelho': { titulo: 'Wyjście z długów', resumo: 'Korzystaj z karty bez pułapek, uporządkuj i negocjuj długi.' },
    'comecando-a-investir': { titulo: 'Początki inwestowania', resumo: 'Inflacja, procent składany i pierwsze kroki w inwestowaniu.' },
  },
  aulas: {
    'reserva-emergencia': {
      titulo: 'Jak zbudować fundusz awaryjny',
      resumo: 'Pierwszy krok do spokoju w sprawach pieniędzy.',
      paragrafos: [
        'Fundusz awaryjny to pieniądze odłożone wyłącznie na nieprzewidziane sytuacje: utratę pracy, problem zdrowotny, awarię samochodu. Dzięki niemu niespodzianka nie zamienia się w dług na karcie ani debet na koncie.',
        'Częsta wskazówka to odłożyć równowartość 3–6 miesięcy niezbędnych wydatków. Osoby o zmiennym dochodzie (np. prowadzące działalność) zwykle potrzebują więcej, około 12 miesięcy.',
        'Te pieniądze powinny być w bezpiecznym miejscu, z którego można je szybko wypłacić, najlepiej tego samego dnia. Wysoki zysk nie jest celem: ważne, by były dostępne, gdy ich potrzebujesz.',
        'Zacznij od małych kwot. Ustalenie stałej miesięcznej sumy, nawet niewielkiej, i odkładanie jej zaraz po wypłacie działa lepiej niż czekanie, aż coś zostanie na koniec miesiąca.',
      ],
      pontosChave: [
        'Cel: pokryć nieprzewidziane wydatki bez zadłużania się.',
        'Częsta wskazówka: 3–6 miesięcy niezbędnych wydatków.',
        'Bezpieczeństwo i szybki dostęp są ważniejsze niż zysk.',
        'Oszczędzaj na początku miesiąca, nie z tego, co zostanie.',
      ],
      quiz: {
        pergunta: 'Jaka cecha miejsca, w którym trzymasz fundusz awaryjny, jest najważniejsza?',
        opcoes: ['Jak największy zysk', 'Bezpieczeństwo i szybka wypłata', 'Zablokowanie na kilka lat'],
        explicacao: 'Fundusz jest na nagłe sytuacje: musi być dostępny, gdy go potrzebujesz, nawet jeśli zarabia mniej.',
      },
    },
    'regra-50-30-20': {
      titulo: '50/30/20: jak to działa?',
      resumo: 'Prosty sposób na podział pieniędzy co miesiąc.',
      paragrafos: [
        'Zasada 50/30/20 dzieli dochód netto (to, co wpływa na konto) na trzy części: 50% na potrzeby, 30% na zachcianki i 20% na cele finansowe.',
        'Potrzeby to wydatki, których nie da się uniknąć: mieszkanie, podstawowe rachunki, zakupy spożywcze, transport, zdrowie. Zachcianki umilają życie, ale można je ograniczyć: rozrywka, zakupy, restauracje, subskrypcje.',
        '20% idzie na przyszłość: fundusz awaryjny, spłatę długów i inwestowanie na Twoje cele.',
        'Te liczby to punkt wyjścia, a nie sztywna reguła. Jeśli potrzeby przekraczają 50%, najpierw ogranicz zachcianki. W EcoTrust możesz użyć budżetów kategorii, aby wprowadzić ten plan w życie.',
      ],
      pontosChave: ['50% potrzeby, 30% zachcianki, 20% przyszłość.', 'Za podstawę przyjmij dochód netto.', 'Dopasuj procenty do swojej sytuacji.'],
      quiz: {
        pergunta: 'Na co przeznacza się 20% w zasadzie 50/30/20?',
        opcoes: ['Rozrywka i zakupy', 'Rachunki domowe', 'Fundusz awaryjny, długi i inwestycje'],
        explicacao: '20% to pieniądze na przyszłość: fundusz awaryjny, spłata długów i inwestowanie.',
      },
    },
    'gastos-recorrentes': {
      titulo: 'Jak kontrolować wydatki cykliczne',
      resumo: 'Subskrypcje i stałe opłaty ważą więcej, niż się wydaje.',
      paragrafos: [
        'Wydatki cykliczne powtarzają się co miesiąc: czynsz lub rata kredytu, opłaty administracyjne, internet, telefon, siłownia i subskrypcje. Ponieważ są automatyczne, łatwo zapomnieć, ile razem wynoszą.',
        'Dobra wskazówka to utrzymywać stałe opłaty na poziomie 30–50% dochodu. Powyżej tej granicy każda niespodzianka napina budżet.',
        'Co kilka miesięcy zrób przegląd: wypisz wszystko, co jest pobierane automatycznie, i zastanów się, czy nadal korzystasz z każdej usługi. Anulowanie zapomnianej subskrypcji to oszczędność, która powtarza się co miesiąc.',
        'Warto też renegocjować lub porównywać oferty: internet, telefon, energia i ubezpieczenia często mają lepsze warunki dla tych, którzy o nie pytają. W EcoTrust oznacz powtarzające się wydatki jako „cykliczne", aby zobaczyć sumę.',
      ],
      pontosChave: ['Zsumuj wszystko, co jest pobierane co miesiąc.', 'Regularnie przeglądaj subskrypcje.', 'Renegocjacja stałych opłat to trwała oszczędność.'],
      quiz: {
        pergunta: 'Które działanie trwale zmniejsza wydatki cykliczne?',
        opcoes: ['Przegląd i anulowanie nieużywanych subskrypcji', 'Płacenie rachunków po terminie', 'Zmiana karty co miesiąc'],
        explicacao: 'Każda anulowana subskrypcja to oszczędność, która powtarza się co miesiąc.',
      },
    },
    'gastos-superfluos': {
      titulo: 'Wydatki nieistotne: ograniczać bez cierpienia',
      resumo: 'Nie chodzi o rezygnację z życia, tylko o lepsze wybory.',
      paragrafos: [
        'Rozrywka, zakupy, jedzenie z dowozem i podróże są częścią dobrego życia. Problem pojawia się, gdy rosną niezauważenie i zajmują miejsce funduszu awaryjnego i celów.',
        'Zamiast wszystko obcinać, ustal miesięczny limit dla tych kategorii. Wiedza, ile jeszcze możesz wydać, daje swobodę i chroni przed wyrzutami sumienia.',
        'Pomaga kilka strategii: odczekanie 48 godzin przed zakupem pod wpływem impulsu, wybieranie tego, co naprawdę cenisz, i rezygnacja z tego, co robisz z przyzwyczajenia.',
        'Małe cięcia się sumują. Obniżenie wydatków nieistotnych o 10% i przekazanie tej kwoty na cel daje efekt już po kilku miesiącach.',
      ],
      pontosChave: ['Ustalaj limity, nie zakazy.', 'Odczekaj przed zakupem pod wpływem impulsu.', 'Przekazuj zaoszczędzone pieniądze na cel.'],
      quiz: {
        pergunta: 'Jaki jest najbardziej trwały sposób radzenia sobie z wydatkami nieistotnymi?',
        opcoes: ['Obcięcie wszystkich naraz', 'Ustalenie dla nich miesięcznego limitu', 'Ignorowanie ich i sprawdzanie na koniec miesiąca'],
        explicacao: 'Limit pozwala cieszyć się bez wyrzutów sumienia i chroni Twoje cele.',
      },
    },
    'sair-das-dividas': {
      titulo: 'Jak wyjść z długów: od czego zacząć',
      resumo: 'Krok po kroku: jak uporządkować i spłacić to, co jesteś winien.',
      paragrafos: [
        'Pierwszy krok to dokładnie wiedzieć, ile jesteś winien: komu, ile, jakie jest oprocentowanie (sprawdź RRSO) i wysokość rat. Spisanie wszystkiego na liście zdejmuje ciężar niewiadomej.',
        'Najpierw spłacaj długi z najwyższym oprocentowaniem, takie jak karta spłacana minimalną kwotą i debet na koncie. Rosną bardzo szybko i powinny zniknąć jako pierwsze.',
        'Spróbuj renegocjować. Wierzyciele często zgadzają się na inne terminy lub raty, zwłaszcza jeśli skontaktujesz się z nimi, zanim opóźnisz płatność. Połączenie kilku długów w jeden tańszy kredyt też może pomóc, o ile nie wrócisz do korzystania ze starego limitu.',
        'W trakcie spłaty unikaj nowych długów i uważnie śledź wydatki. Gdy już wyjdziesz na prostą, fundusz awaryjny chroni przed powrotem do długów.',
      ],
      pontosChave: [
        'Spisz wszystkie długi z oprocentowaniem (RRSO) i ratami.',
        'Zacznij od najwyższego oprocentowania.',
        'Renegocjuj, zanim opóźnisz płatność.',
        'Potem zbuduj fundusz awaryjny, aby nie wrócić do długów.',
      ],
      quiz: {
        pergunta: 'Które długi zwykle spłaca się najpierw?',
        opcoes: ['Najmniejsze', 'Te z najwyższym oprocentowaniem', 'Najstarsze'],
        explicacao: 'Długi takie jak kredyt odnawialny na karcie i debet rosną najszybciej, więc spłaca się je jako pierwsze.',
      },
    },
    'primeiros-investimentos': {
      titulo: 'Pierwsze kroki w inwestowaniu',
      resumo: 'Co warto zrozumieć, zanim zaczniesz pomnażać pieniądze.',
      paragrafos: [
        'Przed inwestowaniem warto spłacić drogie długi i mieć gotowy fundusz awaryjny. Dzięki temu nie musisz sprzedawać inwestycji w najgorszym momencie.',
        'Każda inwestycja łączy trzy cechy: zysk (ile przynosi), ryzyko (jak bardzo może się wahać lub tracić) i płynność (jak szybko zamienia się w pieniądze na koncie). Żadna opcja nie jest najlepsza we wszystkich trzech naraz.',
        'W instrumentach o stałym dochodzie zasady są znane od początku, jak w lokatach terminowych i obligacjach, także skarbowych. W instrumentach o zmiennym dochodzie, jak akcje i wiele funduszy, wartość zmienia się wraz z rynkiem i może spaść.',
        'Twój profil inwestora (ostrożny, umiarkowany lub dynamiczny) i horyzont każdego celu pomagają w wyborze. Dywersyfikacja, czyli nietrzymanie wszystkiego w jednym miejscu, zmniejsza ryzyko. W UE uprawnione instytucje muszą ocenić, czy produkt jest dla Ciebie odpowiedni (zasady MiFID II). Ta treść ma charakter edukacyjny i nie jest rekomendacją inwestycyjną.',
      ],
      pontosChave: [
        'Najpierw: spłacone drogie długi i gotowy fundusz awaryjny.',
        'Zysk, ryzyko i płynność idą w parze.',
        'Wybieraj zgodnie z profilem i horyzontem celu.',
        'Dywersyfikuj.',
      ],
      quiz: {
        pergunta: 'Co warto mieć, zanim zaczniesz inwestować?',
        opcoes: ['Spłacone drogie długi i fundusz awaryjny', 'Nowy samochód', 'Kredyt, aby zainwestować więcej'],
        explicacao: 'Dzięki temu nie musisz sprzedawać w złym momencie ani płacić wyższych odsetek, niż zarabiasz.',
      },
    },
    'metas-financeiras': {
      titulo: 'Jak wyznaczać cele, które działają',
      resumo: 'Zamień marzenia w plany z kwotą i terminem.',
      paragrafos: [
        '„Chcę oszczędzać" to życzenie. „Chcę odłożyć 6000 na podróż w ciągu 12 miesięcy" to cel: ma kwotę, termin i powód.',
        'Znając kwotę i termin, łatwo obliczyć, ile odkładać miesięcznie. W przykładzie to 500 miesięcznie. Jeśli to się nie mieści w budżecie, zmień termin lub cel.',
        'Śledzenie postępów podtrzymuje motywację. Zapisuj każdą odłożoną kwotę i świętuj etapy, takie jak 25% i 50%.',
        'Zacznij od jednego lub dwóch celów. Zbyt wiele celów naraz rozprasza pieniądze i wydłuża czas realizacji.',
      ],
      pontosChave: ['Cel = kwota + termin + powód.', 'Podziel kwotę przez liczbę miesięcy, aby poznać ratę.', 'Śledź i świętuj postępy.'],
      quiz: {
        pergunta: 'Co zamienia życzenie w cel?',
        opcoes: ['Opowiedzenie o nim znajomym', 'Kwota, termin i powód', 'Odkładanie tego, co zostanie'],
        explicacao: 'Znając kwotę i termin, wiesz, ile odkładać co miesiąc, a powód podtrzymuje motywację.',
      },
    },
    'para-onde-vai-o-dinheiro': {
      titulo: 'Dokąd idą Twoje pieniądze',
      resumo: 'Zapisywanie wydatków to pierwszy krok do lepszych decyzji.',
      paragrafos: [
        'Wiele osób wie, ile zarabia, ale nie wie, ile wydaje. Bez tej wiedzy każdy plan jest zgadywaniem: pieniądze znikają i zostaje wrażenie, że nigdy nic nie zostaje.',
        'Już kilka tygodni zapisywania przychodów i wydatków ujawnia wzorce. Drobne codzienne wydatki, jak kawa, aplikacje i opłaty, zwykle sumują się do większej kwoty, niż się wydaje.',
        'Podziel wydatki na kategorie, takie jak mieszkanie, jedzenie, transport i rozrywka. Łatwo wtedy zobaczyć, gdzie jest największy ciężar i gdzie można coś zmienić.',
        'Celem nie jest obwinianie się, tylko jasny obraz. Mając liczby w ręku, decydujesz, co jest priorytetem. W EcoTrust historia i podsumowanie miesiąca liczą to za Ciebie.',
      ],
      pontosChave: ['Bez zapisów nie da się planować.', 'Drobne wydatki mocno się sumują w miesiącu.', 'Kategorie pokazują, gdzie jest największy ciężar.'],
      quiz: {
        pergunta: 'Po co zapisywać codzienne wydatki?',
        opcoes: ['Aby widzieć, dokąd idą pieniądze, i lepiej decydować', 'Bo wymaga tego prawo', 'Aby wydać więcej na koniec miesiąca'],
        explicacao: 'Liczby pokazują wzorce, które łatwo przeoczyć, np. drobne wydatki, które bardzo się sumują.',
      },
    },
    'juros-do-cartao': {
      titulo: 'Karta kredytowa bez pułapek',
      resumo: 'Jak korzystać z karty na swoją korzyść i unikać najdroższych odsetek.',
      paragrafos: [
        'Karta kredytowa jest wygodna i może nawet pomóc uporządkować zakupy w miesiącu. Problem zaczyna się, gdy wyciąg nie jest spłacany w całości.',
        'Jeśli spłacasz tylko część (kwotę minimalną lub w ratach), reszta staje się kredytem odnawialnym, jedną z najdroższych form pożyczania. Zawsze porównuj RRSO, które pokazuje całkowity roczny koszt.',
        'Aby dobrze z niej korzystać: traktuj limit jak pieniądze, które już masz, a nie dodatkowy dochód. Zapisuj zakupy na raty, bo obciążają wyciągi w kolejnych miesiącach.',
        'Jeśli wyciąg nie mieści się już w budżecie, porozmawiaj z bankiem przed terminem spłaty, aby poznać opcje z niższym oprocentowaniem.',
      ],
      pontosChave: ['Zawsze spłacaj wyciąg w całości.', 'Kredyt odnawialny na karcie ma bardzo wysokie oprocentowanie.', 'Dzisiejsze raty zabierają jutrzejszy dochód.'],
      quiz: {
        pergunta: 'Co się dzieje, gdy spłacasz tylko kwotę minimalną karty?',
        opcoes: ['Nic, reszta zostaje umorzona', 'Reszta staje się kredytem o bardzo wysokim oprocentowaniu', 'Rośnie limit karty'],
        explicacao: 'Niespłacona kwota staje się kredytem odnawialnym, jednym z najdroższych kredytów na rynku.',
      },
    },
    'negociar-dividas': {
      titulo: 'Jak negocjować dług',
      resumo: 'Przygotuj się, aby uzyskać warunki pasujące do Twojego budżetu.',
      paragrafos: [
        'Przed negocjacjami ustal, ile możesz płacić miesięcznie, nie rezygnując z rzeczy niezbędnych. Przyjęcie raty, która się nie mieści, tylko odsuwa problem.',
        'Zapytaj o całkowitą kwotę propozycji, RRSO i liczbę rat. Niska rata przez wiele miesięcy może w sumie kosztować znacznie więcej.',
        'Wierzyciele często proponują lepsze warunki osobom, które kontaktują się wcześnie. W wielu krajach UE działają publiczne lub bezpłatne poradnie dla osób nadmiernie zadłużonych: poszukaj tej w swoim kraju.',
        'Zachowuj wszystkie potwierdzenia i porozumienie na piśmie. Negocjuj tylko oficjalnymi kanałami wierzyciela i uważaj na każdego, kto żąda zapłaty z góry za „wyczyszczenie" Twojej historii kredytowej.',
      ],
      pontosChave: ['Przed negocjacjami ustal, co mieści się w miesiącu.', 'Porównuj całkowitą kwotę, nie tylko ratę.', 'Korzystaj tylko z oficjalnych kanałów i zachowaj porozumienie.'],
      quiz: {
        pergunta: 'Co najważniejsze porównać, oceniając propozycję restrukturyzacji długu?',
        opcoes: ['Tylko wysokość raty', 'Całkowitą kwotę, odsetki i czy rata mieści się w miesiącu', 'Kolor listu z banku'],
        explicacao: 'Niska rata przez wiele miesięcy może kosztować dużo więcej. Patrz na sumę i na to, czy mieści się w budżecie.',
      },
    },
    inflacao: {
      titulo: 'Inflacja: dlaczego leżące pieniądze tracą wartość',
      resumo: 'Zrozum, co zjada Twoją siłę nabywczą.',
      paragrafos: [
        'Inflacja to ogólny wzrost cen w czasie. Przez nią za tę samą kwotę kupuje się co roku mniej.',
        'Dlatego pieniądze, które nic nie zarabiają, powoli tracą wartość. Jeśli ceny rosną o 5% w ciągu roku, za 100 leżących bez ruchu kupisz tyle, co wcześniej za około 95.',
        'Aby chronić siłę nabywczą, zysk z oszczędności musi być wyższy niż inflacja. Ten zysk ponad inflację nazywa się realną stopą zwrotu.',
        'W UE inflację mierzy się zharmonizowanym wskaźnikiem cen konsumpcyjnych (HICP). W strefie euro Europejski Bank Centralny dąży do utrzymania jej na poziomie 2% w średnim terminie; kraje z własną walutą mają własny bank centralny.',
      ],
      pontosChave: ['Inflacja = rosnące ceny i pieniądz, za który kupisz mniej.', 'Leżące pieniądze tracą siłę nabywczą.', 'Szukaj zysku wyższego niż inflacja.'],
      quiz: {
        pergunta: 'Jeśli inflacja w roku wyniosła 5%, a Twoje pieniądze zarobiły 3%, co się stało?',
        opcoes: ['Siła nabywcza wzrosła', 'Siła nabywcza spadła', 'Nic się nie zmieniło'],
        explicacao: 'Zysk był niższy niż inflacja, więc za Twoje pieniądze kupisz teraz mniej.',
      },
    },
    'juros-compostos': {
      titulo: 'Procent składany: czas działa na Twoją korzyść',
      resumo: 'Dlaczego wczesny start robi tak dużą różnicę.',
      paragrafos: [
        'Przy procencie składanym zysk z każdego miesiąca sam zaczyna przynosić zysk w kolejnych miesiącach. To słynne „odsetki od odsetek".',
        'Na początku różnica wydaje się mała, ale z czasem przyspiesza. Im dłuższy horyzont, tym większa część sumy pochodzi z samych zysków.',
        'Dlatego wczesny start, nawet z małą kwotą, zwykle daje więcej niż późny start z większymi sumami. Liczy się też regularność: comiesięczne wpłaty wzmacniają efekt.',
        'Ten sam mechanizm działa przeciwko Tobie przy długach. Procent składany sprawia, że dług na karcie rośnie bardzo szybko, kolejny powód, by spłacić go jako pierwszy.',
      ],
      pontosChave: ['Zyski same zaczynają przynosić zyski.', 'Czas i regularność wzmacniają efekt.', 'Przy długach efekt działa przeciwko Tobie.'],
      quiz: {
        pergunta: 'Który czynnik najbardziej wzmacnia efekt procentu składanego?',
        opcoes: ['Czas', 'Wypłacanie zysków co miesiąc', 'Zmiana inwestycji co tydzień'],
        explicacao: 'Im dłużej pieniądze pracują, tym więcej zysków generują same zyski.',
      },
    },
  },
  dicas: [
    'Oszczędzaj w dniu wypłaty, a nie z tego, co zostanie na koniec miesiąca.',
    'Przed zakupem pod wpływem impulsu odczekaj 48 godzin. Często ochota mija.',
    'Co trzy miesiące przeglądaj subskrypcje i anuluj te, z których nie korzystasz.',
    'Spłacanie tylko minimum karty zamienia resztę w kredyt o bardzo wysokim oprocentowaniu.',
    'Codzienne zapisywanie wydatków zajmuje mniej niż minutę i pokazuje, dokąd idą pieniądze.',
    'Porównywanie cen stałych usług (internet, telefon, energia, ubezpieczenia) może przynosić oszczędności co miesiąc.',
    'Cel z terminem łatwiej osiągnąć niż „odkładanie tego, co się da".',
    'Zanim zaczniesz inwestować, zbuduj fundusz awaryjny.',
  ],
  conceitos: [
    { termo: 'Fundusz awaryjny', definicao: 'Pieniądze na nieprzewidziane sytuacje, w bezpiecznym i szybko dostępnym miejscu. Częsta wskazówka: 3–6 miesięcy niezbędnych wydatków.' },
    { termo: 'Płynność', definicao: 'Jak łatwo i szybko inwestycję można zamienić na dostępne pieniądze bez utraty wartości.' },
    {
      termo: 'Procent składany',
      definicao: 'Odsetki liczone od kwoty początkowej powiększonej o już naliczone odsetki. Dzięki nim inwestycje z czasem rosną szybciej, ale też długi szybko się powiększają.',
    },
    {
      termo: 'Stopy procentowe EBC',
      definicao: 'Stopy referencyjne ustalane przez Europejski Bank Centralny dla strefy euro. Wpływają na oprocentowanie lokat i kredytów. Kraje UE z własną walutą, jak Polska, mają własny bank centralny.',
    },
    { termo: 'Euribor', definicao: 'Stopa referencyjna, po której banki strefy euro pożyczają sobie pieniądze. Stosuje się ją w wielu kredytach o zmiennym oprocentowaniu, np. hipotecznych.' },
    {
      termo: 'Inflacja (HICP)',
      definicao: 'Ogólny wzrost cen. W UE mierzy się go zharmonizowanym wskaźnikiem cen konsumpcyjnych. Jeśli inwestycja przynosi mniej niż inflacja, tracisz siłę nabywczą.',
    },
    {
      termo: 'RRSO',
      definicao: 'Rzeczywista roczna stopa oprocentowania: całkowity roczny koszt kredytu, z odsetkami i opłatami. W UE trzeba ją zawsze podawać i służy do porównywania kredytów.',
    },
    { termo: 'Stały dochód', definicao: 'Inwestycje, których zasady zysku są znane od początku, jak lokaty terminowe i obligacje.' },
    { termo: 'Zmienny dochód', definicao: 'Inwestycje, których wartość zmienia się z rynkiem, jak akcje i wiele funduszy. Mogą przynieść więcej, ale mogą też spaść.' },
    {
      termo: 'Gwarancja depozytów',
      definicao: 'W UE depozyty bankowe są chronione do 100 000 € (lub równowartości w walucie krajowej) na deponenta w każdym banku, jeśli bank upadnie. Inwestycje, takie jak akcje i fundusze, nie są objęte ochroną.',
    },
    {
      termo: 'Kredyt odnawialny na karcie',
      definicao: 'Kredyt powstający, gdy spłacasz mniej niż cały wyciąg z karty. Ma bardzo wysokie oprocentowanie: spłacanie tylko minimum sprawia, że dług rośnie.',
    },
  ],
};
