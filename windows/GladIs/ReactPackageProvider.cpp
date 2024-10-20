#include "pch.h"
#include "ReactPackageProvider.h"
#include "NativeModules.h"

#include "Modules\FileOpenPicker.h"

using namespace winrt::Microsoft::ReactNative;

namespace winrt::GladIs::implementation
{

void ReactPackageProvider::CreatePackage(IReactPackageBuilder const &packageBuilder) noexcept
{
    AddAttributedModules(packageBuilder, true);
}

} // namespace winrt::GladIs::implementation