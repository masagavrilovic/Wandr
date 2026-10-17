import { BadRequestException, Injectable } from '@nestjs/common';
import currenciesData from './currency.data.json';

export interface Currency {
    name: string;
    code: string;
    minorUnits: number;
}

@Injectable()
export class CurrencyService {
    private readonly byCode = new Map<string, Currency>();
    private readonly list: Currency[];

    constructor() {
        const rawJson = (currenciesData as any).default || currenciesData;
        const entries = rawJson?.ISO_4217?.CcyTbl?.CcyNtry || [];

        for (const item of entries) {
            if (item && item.Ccy && item.CcyMnrUnts !== undefined) {
                const minorUnits = Number(item.CcyMnrUnts);

                if (Number.isInteger(minorUnits)) {
                    const currency: Currency = {
                        name: item.CcyNm || item.Ccy,
                        code: item.Ccy,
                        minorUnits: minorUnits,
                    };
                    this.byCode.set(currency.code, currency);
                }
            }
        }

        this.list = [...this.byCode.values()]
        .map(({ code, name, minorUnits }) => ({ code, name, minorUnits }))
        .sort((a, b) => a.code.localeCompare(b.code));
    }

    findAll(): Currency[] {
        return this.list;
    }

    exists(code: string): boolean {
        return this.byCode.has(code);
    }

    get(code: string): Currency {
        const currency = this.byCode.get(code);
        if (!currency) throw new BadRequestException(`Unsupported currency: ${code}`);
        return currency;
    }

    convertMinor(amountMinor: number, from: Currency, to: Currency, rate: number): number {
        const factor = Math.pow(10, to.minorUnits - from.minorUnits);
        return Math.round(amountMinor * rate * factor);
    }
}