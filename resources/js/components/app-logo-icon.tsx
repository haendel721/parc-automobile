
import dgsr from '../../../resources/images/logo_dgsr.png'
export default function AppLogoIcon() {
    return (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-2 shadow-sm">
            <img src={`${dgsr}`} alt="Logo dgsr" className="h-10 w-10 object-contain" />
        </div>
    );
}
