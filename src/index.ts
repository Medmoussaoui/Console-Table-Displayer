
/**
 * 
 *  +-----------++----------+ 
 *  |  CONSOLE  ||  TABLE   |
 *  +-----------++----------+
 *  |           ||          |
 *  |           ||          |
 *  |           ||          |
 *  |           ||          |
 *  |           ||          |
 *   ----------------------- 
 */


class DrawTableOperations {
    drawDahses(count: number): string {
        let drawing = "";
        for (let c = 0; c < count; c++) drawing += "-";
        return drawing;
    }

    setMarging(draw: string, marging: number): string {
        let spaces = "";
        for (let c = 0; c < marging; c++) spaces += " ";
        return `${spaces}${draw}${spaces}`;
    }

}

class ColumnRow extends DrawTableOperations {
    value: string;
    margin: number = 2;
    length: number = 0;

    constructor(value: string) {
        super();
        this.value = value;
        this.length = value.length + this.margin;
    }

    /// To Expand The With of Colum and that apply on rows Too
    ///
    expand(length: number) {
        this.length = length;
    }


    align(row: string): string {
        let alinedRow = row;
        if (row.length > this.length) {
            const limit = row.length - this.length;
            for (let count = 0; count < limit; count++) {
                alinedRow = alinedRow.slice(0, alinedRow.length - 1);
            }
        }
        return alinedRow;
    }

    drawRow(): string {
        const margin = Math.round((this.length - this.value.length) / 2);
        let row = this.align(this.setMarging(this.value, margin));
        return `|${row}|`;
    }


}


class Column extends DrawTableOperations {
    name: string;
    marging: number = 2;
    lenght: number;

    constructor(name: string) {
        super();
        this.name = name;
        this.lenght = name.length + this.marging;
    }

    columnRows: ColumnRow[] = [];

    /// To Expand The With of Colum and that apply on rows Too
    ///
    expand(length: number) {
        this.lenght = length + this.marging;
    }

    align(column: string): string {
        let alinedColumn = column;
        if (column.length > this.lenght) {
            const limit = column.length - this.lenght;
            for (let count = 0; count < limit; count++) {
                alinedColumn = alinedColumn.slice(0, alinedColumn.length - 1);
            }
        }
        return alinedColumn;
    }

    drawColumn(): string {
        const margin = Math.round((this.lenght - this.name.length) / 2);
        const column = this.align(this.setMarging(this.name, margin));
        return `|${column}|`;
    }

    addRow(row: ColumnRow) {
        if (row.length > this.lenght) this.expand(row.length);
        if (row.length < this.lenght) row.expand(this.lenght);
        this.columnRows.push(row);
    }

    drawRow(index: number): string {
        const row = this.columnRows[index];
        row.expand(this.lenght);
        return row.drawRow();
    }

    drawHorizontalBorder(): string {
        let dashes = "";
        for (let count = 0; count < this.lenght; count++) {
            dashes += "-";
        }
        return `+${dashes}+`;
    }
}


class Table extends DrawTableOperations {
    jsonData: {}[];
    columns: Column[] = [];

    constructor(jsonData: {}[]) {
        super();
        this.jsonData = jsonData;
        this.convert();
    }

    convert(): void {
        this.conertJsonKeysToColumns();
        this.conertJsonValuesToRows();
    }

    conertJsonKeysToColumns() {
        const keys = Object.keys(this.jsonData[0]);
        for (let key of keys) this.addColumn(new Column(key));
    }

    conertJsonValuesToRows() {
        for (let item of this.jsonData) {
            const values = Object.values<string>(item);
            this.addRow(values);
        }
    }


    addColumn(column: Column | Column[]): void {
        if (Array.isArray(column)) {
            for (let c of column) this.columns.push(c);
            return;
        }
        this.columns.push(column);
    }

    setColumnsBorder(columns: string): string {
        let border = "";
        for (let column of this.columns) {
            border += column.drawHorizontalBorder();
        }
        return `${border}\n${columns}\n${border}`;
    }

    drawColumns(): string {
        let columns = "";
        for (let column of this.columns) {
            columns += column.drawColumn();
        }
        return this.setColumnsBorder(columns);
    }

    drawRows(): string {
        const rowsSize = this.columns[0].columnRows.length;
        let drawing = "";
        for (let index = 0; index < rowsSize; index++) {
            drawing += `${this.drawSingleRow(index)}`;
            if (index < rowsSize - 1) drawing += "\n";
        }
        return drawing;
    }

    drawSingleRow(index: number) {
        let drawing = "";
        for (let column of this.columns) {
            drawing += column.drawRow(index);
        }
        return drawing;
    }

    addRow(row: string[]) {
        for (let index = 0; index < this.columns.length; index++) {
            const column = this.columns[index];
            const value = row[index] ?? "";
            column.addRow(new ColumnRow(value));
        }
    }

    drawBottomBorder(): string {
        let border = "";
        for (let column of this.columns) {
            // [2] of the horisantal line >|< column name >|< 
            border += this.drawDahses(column.lenght + 2);
        }
        return border;
    }

    drawTable(): string {
        const columns = this.drawColumns();
        const rows = this.drawRows();
        const bottomBorder = this.drawBottomBorder();
        return `${columns}\n${rows}\n${bottomBorder}`;
    }
}

const busTable = new Table([
    {
        "Bus Number": "50 A 15200",
        "Bus Id": "50",
        "Bus Available Places": "1500 Place"
    },
    {
        "Bus Number": "60 A 15200",
        "Bus Id": "40",
        "Bus Available Places": "50 Place",
    },
    {
        "Bus Number": "13 B 15200",
        "Bus Id": "25",
        "Bus Available Places": "32 Place",
    },
    {
        "Bus Number": "00 Z 000dsddddsdsddsdsddsdsdsddss",
        "Bus Id": "125481",
        "Bus Available Places": "ssssqsqsqssqskkkkqddddfdddddsdssdlskdskldsdsddks",
    },
    {
        "Bus Number": "00 Z 000dsddddsdsddsdsddsdsdsddss",
        "Bus Id": "125481",
        "Bus Available Places": "ssssqsqsqssqskkkkqddddfdddddsdssdlskdskldsdsdd",
    },

]);

// to add new Row Into Table
// busTable.addRow();

// to draw The Table call drawTable() Function
const drawTable = busTable.drawTable();

// Display Table on The Console
console.log(drawTable);
