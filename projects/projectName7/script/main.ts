interface Task {
  //הגדרת משתנה task
  id: number;
  title: string;
  description: string;
  addedTime: string;
  priority: PriorityTypes;
  isCompleted: boolean;
}
//סוגי הרמות
enum PriorityTypes {
  low,
  medium,
  high,
}
//מערך מסוג task אשר יוצג בתחילת כל הרצת הפרויקט
class TaskManager {
  tasks: Task[] = [
    {
      id: 3,
      title: "משימה ראשונה",
      addedTime: "2023-07-18 11:11:22",
      description: "לקנות ביצים וחלב מהסופר",
      isCompleted: false,
      priority: PriorityTypes.low,
    },
    {
      id: 8,
      title: "משימה שנייה",
      addedTime: "2023-07-19 11:11:22",
      description: "לאסוף את מתן מהבריכה ב17 בערב",
      isCompleted: false,
      priority: PriorityTypes.high,
    },
    {
      id: 15,
      title: "משימה שלישית",
      addedTime: "2023-07-30 11:11:22",
      description: "להוציא את ניה בערב ולתת לה אוכל בקערה",
      isCompleted: false,
      priority: PriorityTypes.medium,
    },
  ];

  constructor() {
    this.showTasks();

    const elem = document.querySelector("header");

    // מגדירים שבלחיצה על הכפתור תופעל פונקציה המוסיפה משימה
    elem?.querySelector("button")?.addEventListener("click", (ev) => {
      const elemTitle = elem?.querySelector("input");
      const elemPriority = elem?.querySelector("select");

      const title = elemTitle?.value || "";
      const priority = elemPriority?.value || "";

      // איפוס התיבה של הכותרת
      if (elemTitle) {
        elemTitle.value = "";
      }

      // איפוס התיבה של רמת העדיפות
      if (elemPriority) {
        elemPriority.value = "";
      }

      this.addTask(title, +priority);
    });
  }
  //פונקציה הלוקחת את הנתונים ומוסיפה משימה חדשה
  addTask(title: string, priority?: PriorityTypes) {
    // מערך של ה-ids
    const ids = this.tasks.map((x) => x.id);
    const max = Math.max(...ids);

    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();

    const h = now.getHours();
    const mn = now.getMinutes();
    const s = now.getSeconds();

    const addedTime = `${y}-${m < 10 ? "0" + m : m}-${d} ${h}:${mn}:${s}`;

    const elemDescription = document.getElementById(
      "description"
    ) as HTMLInputElement;
    const description = elemDescription?.value;
    this.tasks.push({
      id: max + 1,
      title,
      description,
      addedTime,
      priority: priority || PriorityTypes.low,
      isCompleted: false,
    });

    this.showTasks();
  }
  //פונקציה המוחקת את המשימה ממערך המשימות ומעדכנת את המסך
  removeTask(taskId: number) {
    const i = this.tasks.findIndex((x) => x.id == taskId);
    this.tasks.splice(i, 1);

    this.showTasks();
  }
  //פונקציה המגדירה את השימה כבוצעה ומעדכנת את המסך
  completeTask(taskId: number) {
    const item = this.tasks.find((x) => x.id == taskId);

    if (item) {
      item.isCompleted = true;
    }

    this.showTasks();
  }
  //פונקציה המגדירה את המשימה כלא בוצעה ומעדכנת את המסך
  unCompleteTask(taskId: number) {
    const item = this.tasks.find((x) => x.id == taskId);

    if (item) {
      item.isCompleted = false;
    }

    this.showTasks();
  }
  // לאחר הוספה/ביצוע/הגדרת לא בוצעה של משימה הפונקציה הנל מעדכנת את המסך ומראה את המשימות בהתאם
  showTasks() {
    const elem = document.querySelector("div.tasks");

    if (elem) {
      elem.innerHTML = "";
    }

    this.tasks.forEach((t) => {
      const div = document.createElement("div");
      const priorityNames = ["נמוכה", "בינונית", "גבוהה"];
      if (t.isCompleted) {
        div.classList.add("completed");
      }

      switch (t.priority) {
        case PriorityTypes.low:
          div.classList.add("low");
          break;
        case PriorityTypes.medium:
          div.classList.add("medium");
          break;
        case PriorityTypes.high:
          div.classList.add("high");
          break;
      }

      div.innerHTML = `
                <h3>${t.title}</h3>
                <p><b>זמן יצירה:</b> ${t.addedTime}</p>
                <p><b>תיאור:</b> ${t.description || "*אין הערה*"}</p>
                <p><b>רמת עדיפות:</b> ${priorityNames[t.priority]}</p>
                <footer>
                    <button class="remove">מחק</button>
                    ${
                      t.isCompleted
                        ? '<button class="uncomplete">לא בוצע</button>'
                        : '<button class="complete">בוצע</button>'
                    }
                </footer>
            `;

      div
        .querySelector(".remove")
        ?.addEventListener("click", () => this.removeTask(t.id));
      div
        .querySelector(".complete")
        ?.addEventListener("click", () => this.completeTask(t.id));
      div
        .querySelector(".uncomplete")
        ?.addEventListener("click", () => this.unCompleteTask(t.id));

      elem?.appendChild(div);
    });
  }
}

const tasks = new TaskManager();
