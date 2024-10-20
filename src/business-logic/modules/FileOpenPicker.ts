import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';

export interface Spec extends TurboModule {
  pickPDFFile(): Promise<string>;
  pickImageFile(): Promise<string>;
  pickCSVFile(): Promise<string>;
}

// Lier le module natif appelé "Estudies" (le nom défini dans le module C++)
export default TurboModuleRegistry.get<Spec>('FileOpenPicker') as Spec | null;
