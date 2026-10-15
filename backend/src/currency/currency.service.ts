import { BadRequestException, Injectable } from '@nestjs/common';
import currenciesData from './currency.data.json';

export interface Currency {
    name: string;
    code: string;
    numericCode: string | number;
    minorUnits: number;
}

@Injectable()
export class CurrencyService {
    private readonly byCode = new Map<string, Currency>();

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
                        numericCode: item.CcyNbr || '',
                        minorUnits: minorUnits,
                    };
                    this.byCode.set(currency.code, currency);
                }
            }
        }
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