import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideApple,
  lucideBeef,
  lucideBuilding,
  lucideCalendar,
  lucideCheck,
  lucideClipboardList,
  lucideClock,
  lucideDroplet,
  lucideDrumstick,
  lucideEgg,
  lucideFish,
  lucideFlame,
  lucideGlobe,
  lucideLeaf,
  lucideMapPin,
  lucideMilk,
  lucideNut,
  lucidePackage,
  lucideSalad,
  lucideShieldAlert,
  lucideShieldCheck,
  lucideSnowflake,
  lucideSparkles,
  lucideSprout,
  lucideTruck,
  lucideUtensils,
  lucideWheat,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { RESTAURANTS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/restaurants-accounts.i18n';
import { t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import {
  RestaurantAccount,
  RestaurantIngredientCategory,
  RestaurantIngredientSource,
  RestaurantIngredientSourceStatus,
} from '../../models/accounts.model';

type CategoryFilter = 'all' | RestaurantIngredientCategory;

interface IngredientSummary {
  total: number;
  imported: number;
  local: number;
  halalVerified: number;
}

interface CategoryFilterChip {
  id: CategoryFilter;
  label: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'mm-restaurant-ingredient-sources',
  standalone: true,
  imports: [NgClass, NgIconComponent],
  templateUrl: './restaurant-ingredient-sources.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideApple,
      lucideBeef,
      lucideBuilding,
      lucideCalendar,
      lucideCheck,
      lucideClipboardList,
      lucideClock,
      lucideDroplet,
      lucideDrumstick,
      lucideEgg,
      lucideFish,
      lucideFlame,
      lucideGlobe,
      lucideLeaf,
      lucideMapPin,
      lucideMilk,
      lucideNut,
      lucidePackage,
      lucideSalad,
      lucideShieldAlert,
      lucideShieldCheck,
      lucideSnowflake,
      lucideSparkles,
      lucideSprout,
      lucideTruck,
      lucideUtensils,
      lucideWheat,
    }),
  ],
})
export class RestaurantIngredientSourcesComponent {
  readonly locale = inject(AppLocaleService);
  readonly restaurant = input.required<RestaurantAccount>();
  readonly copy = computed(() => RESTAURANTS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly categoryFilter = signal<CategoryFilter>('all');

  readonly sources = computed(() => this.restaurant().ingredientSources ?? []);

  readonly summary = computed<IngredientSummary>(() => {
    const list = this.sources();
    return {
      total: list.length,
      imported: list.filter((item) => item.isImported).length,
      local: list.filter((item) => !item.isImported).length,
      halalVerified: list.filter((item) => item.halalCertified).length,
    };
  });

  readonly filterChips = computed<CategoryFilterChip[]>(() => {
    const list = this.sources();
    const c = this.copy();
    const chips: CategoryFilterChip[] = [
      { id: 'all', label: c.ingredientFilterAll, icon: 'lucideUtensils', count: list.length },
    ];

    const categories: RestaurantIngredientCategory[] = [
      'meat',
      'chicken',
      'fish',
      'cheese',
      'seafood',
      'eggs',
      'dairy',
      'vegetables',
      'fruits',
      'grains',
      'nuts',
      'oils',
      'herbs',
      'legumes',
      'sweeteners',
      'other',
    ];

    for (const category of categories) {
      const count = list.filter((item) => item.category === category).length;
      if (count > 0) {
        chips.push({
          id: category,
          label: this.categoryLabel(category),
          icon: this.categoryIcon(category),
          count,
        });
      }
    }

    return chips;
  });

  readonly filteredSources = computed(() => {
    const filter = this.categoryFilter();
    const list = this.sources();
    if (filter === 'all') return list;
    return list.filter((item) => item.category === filter);
  });

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }

  protected setCategoryFilter(id: CategoryFilter): void {
    this.categoryFilter.set(id);
  }

  protected programs(item: RestaurantIngredientSource): string[] {
    return this.locale.isRtl() ? (item.usedInProgramsAr ?? []) : (item.usedInProgramsEn ?? []);
  }

  protected categoryIcon(category: RestaurantIngredientCategory): string {
    switch (category) {
      case 'meat':
        return 'lucideBeef';
      case 'chicken':
        return 'lucideDrumstick';
      case 'fish':
        return 'lucideFish';
      case 'cheese':
      case 'dairy':
        return 'lucideMilk';
      case 'seafood':
        return 'lucideFish';
      case 'eggs':
        return 'lucideEgg';
      case 'vegetables':
        return 'lucideSalad';
      case 'fruits':
        return 'lucideApple';
      case 'grains':
        return 'lucideWheat';
      case 'nuts':
        return 'lucideNut';
      case 'oils':
        return 'lucideDroplet';
      case 'herbs':
        return 'lucideFlame';
      case 'legumes':
        return 'lucideSprout';
      case 'sweeteners':
        return 'lucideSparkles';
      default:
        return 'lucideUtensils';
    }
  }

  protected categoryLabel(category: RestaurantIngredientCategory): string {
    const rtl = this.locale.isRtl();
    switch (category) {
      case 'meat':
        return rtl ? 'لحوم' : 'Meat';
      case 'chicken':
        return rtl ? 'دجاج' : 'Chicken';
      case 'fish':
        return rtl ? 'أسماك' : 'Fish';
      case 'cheese':
        return rtl ? 'أجبان' : 'Cheese';
      case 'seafood':
        return rtl ? 'بحري' : 'Seafood';
      case 'eggs':
        return rtl ? 'بيض' : 'Eggs';
      case 'dairy':
        return rtl ? 'ألبان' : 'Dairy';
      case 'vegetables':
        return rtl ? 'خضروات' : 'Vegetables';
      case 'fruits':
        return rtl ? 'فواكه' : 'Fruits';
      case 'grains':
        return rtl ? 'نشويات وحبوب' : 'Grains & Carbs';
      case 'nuts':
        return rtl ? 'مكسرات وبذور' : 'Nuts & Seeds';
      case 'oils':
        return rtl ? 'زيوت ودهون' : 'Oils & Fats';
      case 'herbs':
        return rtl ? 'أعشاب وبهارات' : 'Herbs & Spices';
      case 'legumes':
        return rtl ? 'بقوليات' : 'Legumes';
      case 'sweeteners':
        return rtl ? 'محليات وعسل' : 'Sweeteners';
      default:
        return rtl ? 'أخرى' : 'Other';
    }
  }

  protected categoryAccent(category: RestaurantIngredientCategory): string {
    switch (category) {
      case 'meat':
        return 'from-rose-500 to-red-600';
      case 'chicken':
        return 'from-amber-400 to-orange-500';
      case 'fish':
        return 'from-sky-400 to-blue-600';
      case 'cheese':
      case 'dairy':
        return 'from-yellow-300 to-amber-500';
      case 'seafood':
        return 'from-cyan-400 to-teal-600';
      case 'eggs':
        return 'from-lime-400 to-emerald-500';
      case 'vegetables':
        return 'from-emerald-400 to-teal-600';
      case 'fruits':
        return 'from-rose-400 to-pink-500';
      case 'grains':
        return 'from-amber-300 to-yellow-600';
      case 'nuts':
        return 'from-orange-400 to-amber-700';
      case 'oils':
        return 'from-yellow-400 to-amber-500';
      case 'herbs':
        return 'from-red-400 to-orange-600';
      case 'legumes':
        return 'from-green-400 to-emerald-600';
      case 'sweeteners':
        return 'from-amber-300 to-yellow-500';
      default:
        return 'from-slate-400 to-slate-600';
    }
  }

  protected categoryIconBg(category: RestaurantIngredientCategory): string {
    switch (category) {
      case 'meat':
        return 'bg-rose-50 text-rose-600 ring-rose-100';
      case 'chicken':
        return 'bg-amber-50 text-amber-600 ring-amber-100';
      case 'fish':
        return 'bg-sky-50 text-sky-600 ring-sky-100';
      case 'cheese':
      case 'dairy':
        return 'bg-yellow-50 text-yellow-700 ring-yellow-100';
      case 'seafood':
        return 'bg-cyan-50 text-cyan-700 ring-cyan-100';
      case 'eggs':
        return 'bg-lime-50 text-lime-700 ring-lime-100';
      case 'vegetables':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
      case 'fruits':
        return 'bg-pink-50 text-pink-700 ring-pink-100';
      case 'grains':
        return 'bg-amber-50 text-amber-800 ring-amber-100';
      case 'nuts':
        return 'bg-orange-50 text-orange-800 ring-orange-100';
      case 'oils':
        return 'bg-yellow-50 text-yellow-800 ring-yellow-100';
      case 'herbs':
        return 'bg-red-50 text-red-600 ring-red-100';
      case 'legumes':
        return 'bg-green-50 text-green-700 ring-green-100';
      case 'sweeteners':
        return 'bg-amber-50 text-amber-700 ring-amber-100';
      default:
        return 'bg-slate-50 text-slate-600 ring-slate-100';
    }
  }

  protected statusLabel(status: RestaurantIngredientSourceStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'verified':
        return rtl ? 'معتمد' : 'Verified';
      case 'pending':
        return rtl ? 'قيد المراجعة' : 'Pending review';
      case 'needs_update':
        return rtl ? 'يحتاج تحديث' : 'Needs update';
    }
  }

  protected statusClasses(status: RestaurantIngredientSourceStatus): Record<string, boolean> {
    return {
      'bg-emerald-50 text-emerald-700 ring-emerald-600/20': status === 'verified',
      'bg-amber-50 text-amber-700 ring-amber-600/20': status === 'pending',
      'bg-red-50 text-red-700 ring-red-600/20': status === 'needs_update',
    };
  }

  protected importLabel(isImported: boolean): string {
    return isImported
      ? this.locale.isRtl()
        ? 'مستورد'
        : 'Imported'
      : this.locale.isRtl()
        ? 'محلي'
        : 'Local';
  }

  protected originCountries(item: RestaurantIngredientSource): string[] {
    return this.locale.isRtl() ? item.originCountriesAr : item.originCountriesEn;
  }

  protected varietyOrigins(
    variety: NonNullable<RestaurantIngredientSource['varieties']>[number],
  ): string {
    const countries = this.locale.isRtl() ? variety.originCountriesAr : variety.originCountriesEn;
    return countries?.join(this.locale.isRtl() ? '، ' : ', ') ?? '—';
  }

  protected allergens(item: RestaurantIngredientSource): string[] {
    return this.locale.isRtl() ? (item.allergensAr ?? []) : (item.allergensEn ?? []);
  }

  protected deliveryFrequency(item: RestaurantIngredientSource): string {
    return this.t(item.deliveryFrequencyAr ?? '', item.deliveryFrequencyEn ?? '');
  }

  protected halalCert(item: RestaurantIngredientSource): string {
    return this.t(item.halalCertAr ?? '', item.halalCertEn ?? '');
  }

  protected carbonFootprintLabel(footprint?: 'low' | 'medium' | 'high'): string {
    if (!footprint) return '';
    const rtl = this.locale.isRtl();
    const c = this.copy();
    switch (footprint) {
      case 'low':
        return c.ingredientCarbonLow;
      case 'medium':
        return c.ingredientCarbonMedium;
      case 'high':
        return c.ingredientCarbonHigh;
    }
  }

  protected carbonFootprintClass(footprint?: 'low' | 'medium' | 'high'): string {
    switch (footprint) {
      case 'low':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 ring-amber-200';
      case 'high':
        return 'bg-rose-50 text-rose-700 ring-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 ring-slate-100';
    }
  }

  protected inspectionScoreClass(score?: number): string {
    if (!score) return '';
    if (score >= 95) return 'text-emerald-600 bg-emerald-50 ring-emerald-100';
    if (score >= 85) return 'text-amber-600 bg-amber-50 ring-amber-100';
    return 'text-rose-600 bg-rose-50 ring-rose-100';
  }
}
